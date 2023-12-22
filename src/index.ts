import { Value } from '@sinclair/typebox/value'
import { Type, Static } from '@sinclair/typebox'

const Person = Type.Object({ name: Type.String() })

const data: unknown = JSON.parse("")

const isValid = Value.Check(Person, data)
const person = Value.Decode(Person, data)