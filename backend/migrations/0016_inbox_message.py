# Generated by Django 4.1.2 on 2022-11-12 09:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0015_alter_author_host_alter_post_origin_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='inbox',
            name='message',
            field=models.CharField(default='No message', max_length=500),
        ),
    ]
