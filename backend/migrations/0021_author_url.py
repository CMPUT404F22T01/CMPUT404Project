# Generated by Django 4.1.2 on 2022-11-19 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0020_node'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='url',
            field=models.URLField(blank=True, max_length=255),
        ),
    ]
