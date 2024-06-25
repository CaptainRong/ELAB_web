from marshmallow import Schema, fields,ValidationError

class ReadPublicMessage(Schema):
    about=fields.List(fields.Dict())
    announcement=fields.Str()