from django.db import models

# Create your models here.


class PlayInfo(models.Model):
    """播放信息管理
    http://183.57.148.19:8000/live/test_2_20181121134636/playlist.m3u8"""
    url = models.CharField(verbose_name="url", max_length=128)
    channel_name = models.CharField(verbose_name="频道名称", max_length=64)
    room_name = models.CharField(verbose_name="房间名称", max_length=64)
