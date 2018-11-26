#!/usr/bin/python3
# coding=utf-8

import threading
import os
import sys
import time
import logging.handlers

import yaml

_quit = False

_logo_ = '''\

PLAY_LIVE      
                                                                                        
'''


class Dict(dict):
    def __init__(self, *args, **kwargs):
        dict.__init__(self, *args, **kwargs)
        self.__dict__ = self


class Settings(object):
    def _GetDict(self):
        filename = '/var/stop_channel/conf/play_live.yaml'

        if not os.path.exists(filename):
            filename = 'play_live.yaml'

        with open(filename, 'r') as fp:
            x = yaml.load(fp)

        res = {}

        for k, v in x.items():
            res[k] = Dict(v)

        return Dict(res)

    def __getattr__(self, name):
        x = self._GetDict()

        if name in x:
            return Dict(x[name])
        else:
            return getattr(x, name)

    def __call__(self):
        x = self._GetDict()

        return x


conf = Settings()


class Monitor:
    def __init__(self, command, logger):
        self.quit = False
        self.command = command
        self.logger = logger
        self.last_time = 0

    def _run_(self):
        while not self.quit and self.thread.isAlive():
            self.last_time = int(time.time())

            line = self.pipe.stdout.readline().decode('utf-8')
            if line == "":
                break
            self.logger.info(line.strip())

        self.pipe.wait()

        self.thread = None

    def start(self):
        import subprocess
        self.last_time = int(time.time())
        self.pipe = subprocess.Popen(self.command, stdin=subprocess.PIPE,
                                     stdout=subprocess.PIPE,
                                     stderr=subprocess.STDOUT,
                                     shell=True)

        self.thread = threading.Thread(target=self._run_)
        self.thread.setDaemon(True)

        self.thread.start()

        self.last_time = int(time.time())

    def stop(self):
        if not self.isAlive():
            return

        cmd = "pkill -9 -P %d" % (self.pipe.pid)
        ret = os.system(cmd)

        self.logger.debug("   ###command:%s ret=%d" % (cmd, ret >> 8))

        self.quit = True

    def isAlive(self):
        if self.quit:
            return False

        if self.thread:
            return self.thread.isAlive()
        else:
            return False


class WatchDog():
    def __init__(self, cmd, logger, watch_need=False):
        self.worker = None
        self.command = cmd
        self.logger = logger
        self.watch_need = watch_need

    def start(self):
        self.worker = threading.Thread(target=self._WatchMonitor, args=())
        self.worker.setDaemon(True)
        self.worker.start()

    def _WatchMonitor(self):
        autostart = True
        command = self.command
        logger = self.logger
        watch_need = self.watch_need

        while not _quit:
            monitor = Monitor(command, logger)
            monitor.start()

            while monitor.isAlive() and not _quit:

                if watch_need:
                    current_time = int(time.time())
                    duration = current_time - monitor.last_time
                    if duration > 600:
                        logger.error('*****-= Timeout[{duration}]:"{cmd}"'.format(cmd=command, duration=duration))
                        break
                time.sleep(1)
            monitor.stop()
            if _quit:
                break
            if not autostart:
                break


if __name__ == "__main__":
    abspath = os.path.abspath(sys.argv[0])
    basepath = os.path.dirname(abspath)
    os.chdir(basepath)

    cmd_init = '''\
    if [ ! -f /etc/play_live.inited ]; then
        touch /etc/play_live.inited
        mkdir -p /var/stop_channel/logs /var/play_live/conf
        cp -f {basepath}/play_live.yaml /var/play_live/conf/play_live.yaml
        cp -f {basepath}/user.conf /var/play_live/conf/user.conf
        rm -f /var/play_live/logs/*
    fi

    if [ ! -f "/var/play_live/conf/play_live.yaml" ]; then
        cp -f {basepath}/play_live.yaml /var/play_live/conf/play_live.yaml 
    fi
    '''.format(basepath=basepath)
    os.system(cmd_init)

    migrations_init = '''\
    if [ ! -f /etc/play_live_migrations.inited ]; then
        touch /etc/play_live_migrations.inited
        python3 manage.py makemigrations
        python3 manage.py migrate
    fi
    '''.format(basepath=basepath)
    os.system(migrations_init)

    logdir = os.path.dirname(conf.web.log)
    if not os.path.exists(logdir):
        os.system("mkdir -p " + logdir)

    #################################################################################

    import signal

    def onsignal_term(signum, frame):
        print("SIGTERM: %s %s" % (signum, frame))
        global _quit
        _quit = True

        signal.default_int_handler(signum, frame)

    # signal.signal(signal.SIGRTMIN, onsignal_term)
    signal.signal(signal.SIGINT, onsignal_term)
    has_print_logo = False
    #################################################################################
    for name, section in conf.items():
        if 'service' not in section:
            continue
        if not section.service:
            continue
        logger = logging.getLogger('log-{n}'.format(n=name))
        formatter = logging.Formatter('%(message)s')
        logger.addHandler(logging.StreamHandler())
        file_handler = logging.handlers.RotatingFileHandler(
            section.log,
            maxBytes=0x800000,
            backupCount=10)
        file_handler.setFormatter(formatter)
        file_handler.setLevel(logging.DEBUG)
        logger.addHandler(file_handler)
        logger.setLevel(logging.DEBUG)

        logo = '''\
```````````````````````````````````````````````````````````````` 
```````````START:{name}-{name}-{name}`````````````
```````````````````````````````````````````````````````````````` 
'''
        logger.info(logo.format(name=name))
        logger.info(section.command)

        if not has_print_logo:
            logger.info(_logo_)
            has_print_logo = True
        watch_need = section.watchdog
        if 'host' in section and 'port' in section:
            command = section.command.format(host=section.host, port=section.port)
        else:
            command = section.command

        d = WatchDog(command, logger, watch_need)
        d.start()

        # NOTICE: if NOT sleep, sometimes just one thread can run
        time.sleep(0.1)
    #################################################################################
    while True:
        time.sleep(5)
