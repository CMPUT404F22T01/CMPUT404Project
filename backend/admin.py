from django.contrib import admin
from . import models


admin.site.register(models.Author)
admin.site.register(models.POST)
admin.site.register(models.Comment)
admin.site.register(models.Like)