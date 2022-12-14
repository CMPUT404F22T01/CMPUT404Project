# Generated by Django 4.1.2 on 2022-11-09 00:18

import backend.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_merge_0009_alter_post_title_0010_alter_post_source'),
    ]

    operations = [
        migrations.AlterField(
            model_name='author',
            name='profileImage',
            field=models.ImageField(blank=True, null=True, upload_to=backend.models.profile_upload_to),
        ),
        migrations.AlterField(
            model_name='post',
            name='origin',
            field=models.URLField(default='https://127.0.0.1:8000/'),
        ),
    ]
