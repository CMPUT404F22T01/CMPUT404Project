# Generated by Django 4.1.2 on 2022-11-08 00:09

import backend.models
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_merge_0009_alter_post_title_0010_alter_post_source'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='inbox',
            options={'ordering': ['-published']},
        ),
        migrations.AlterField(
            model_name='author',
            name='profileImage',
            field=models.ImageField(blank=True, null=True, upload_to=backend.models.profile_upload_to),
        ),
        migrations.AlterField(
            model_name='follower',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='followrequest',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='like',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]