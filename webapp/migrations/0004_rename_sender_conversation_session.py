# Generated by Django 3.2.8 on 2021-10-24 20:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_session_ended'),
    ]

    operations = [
        migrations.RenameField(
            model_name='conversation',
            old_name='sender',
            new_name='session',
        ),
    ]
