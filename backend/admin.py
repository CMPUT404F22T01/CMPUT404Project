from django.contrib import admin
from . import models


admin.site.register(models.Author)
admin.site.register(models.POST)
admin.site.register(models.Comment)
admin.site.register(models.Like)
admin.site.register(models.Follower)
admin.site.register(models.FollowRequest)
admin.site.register(models.Inbox)
admin.site.register(models.Node)


