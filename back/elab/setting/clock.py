from marshmallow import Schema, fields,ValidationError
from datetime import timedelta


class ReadMember(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return ""
        return {k:value[k].total_seconds()/3600 for k in value}

    def _deserialize(self, value, attr, data, **kwargs):
        try:
            return {k:timedelta(hours=value[k]) for k in value}
        except ValueError as error:
            raise ValidationError("") from error



class ReadRequiredDuration(Schema):
    default = fields.TimeDelta(precision='hours')
    member=ReadMember()
    group=fields.Dict()


class ReadClockIn(Schema):
    start_time = fields.Time()
    end_time = fields.Time(format='%H:%M:%S')
    record_expire_day=fields.Int()
    update_weekly_time=fields.Time(format='%H:%M:%S')
    required_duration=fields.Nested(ReadRequiredDuration)

