FROM registry.ctzcdn.com/cdn/django_base:2.0

MAINTAINER zhangyi

RUN pip3 install\
    lxml \
    xmltodict  \
    django-cors-headers \
    requests \
    pyyaml \
    whitenoise==3.3.1 -i http://pypi.douban.com/simple --trusted-host pypi.douban.com

COPY . /root/play_live

CMD /root/play_live/run.py