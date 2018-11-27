from django.shortcuts import render

import logging

logger = logging.getLogger("play_live")
# Create your views here.


def play_live(request, *args, **kwargs):
    path = request.get_full_path()
    url = "http://183.57.148.19:8000"
    url = "http://zb.ctzcdn.net"
    url = f"{url}/{path}/playlist.m3u8"
    logger.info(url)
    return render(request, "rtmpPlay.html", {"url": url})
