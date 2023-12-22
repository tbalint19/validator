const filesystem = require("fs/promises")

const z = {
  string: () => {
    return {
      safeParse: (data) => {
        if ("" + data === data) {
          return { success: true, data: data }
        }
        return { errors: [ "expected string" ], success: false }
      }
    }
  },
  number: () => {
    return {
      safeParse: (data) => {
        if (+data === data) {
          return { success: true, data: data }
        }
        return { errors: [ "expected number" ], success: false }
      }
    }
  },
  boolean: () => {
    return {
      safeParse: (data) => {
        if (!!data === data) {
          return { success: true, data: data }
        }
        return { errors: [ "expected boolean" ], success: false }
      }
    }
  },
  null: () => {
    return {
      safeParse: (data) => {
        if (data === null) {
          return { success: true, data: data }
        }
        return { errors: [ "expected null" ], success: false }
      }
    }
  },
  object: (schema) => {
    return {
      safeParse: (data) => {
        if (+data === data || ""+data === data || !!data === data || data === null)
          return { errors: [ "expected object" ], success: false }

        const isArray = data + [] === "" || data[0] !== undefined
        if (isArray)
          return { errors: [ "expected object" ], success: false }

        let errors = []
        for (const key in schema) {
          const validatorFunction = schema[key]
          const result = validatorFunction.safeParse(data[key])
          if (!result.success)
            errors = [ ...errors, ...result.errors ]
        }
        if (errors[0])
          return { errors: errors, success: false }
        return { data: data, success: true }
      }
    }
  },
  array: (validatorFunction) => {
    return {
      safeParse: (data) => {
        if (+data === data || ""+data === data || !!data === data || data === null)
          return { errors: [ "expected array" ], success: false }
        
        const isArray = data + [] === "" || data[0] !== undefined
        if (!isArray)
          return { errors: [ "expected array" ], success: false }

        let errors = []
        for (const element of data) {
          const result = validatorFunction.safeParse(element)
          if (!result.success)
            errors = [ ...errors, ...result.errors ]
        }

        if (errors[0])
          return { errors: errors, success: false }
        return { data: data, success: true }
      }
    }
  }
}

// ------------------------------

const schema = z.object({
  username: z.string(),
  birthYear: z.number(),
  canVote: z.boolean(),
  pets: z.array(z.object({
    name: z.string(),
    age: z.number(),
  }))
})

const myFunctionThatDoesSomethingWithAPerson = (p) => {

}

const demo = async () => {
  try {
    const input = await filesystem.readFile("./akarmi.txt", "utf-8")
    const data = JSON.parse(input)
  
    const result = schema.safeParse(data)
  
    if (!result.success)
      return console.log(result.errors)
    
    const validatedData = result.data
  
    const res1 = myFunctionThatDoesSomethingWithAPerson(validatedData)
    
  } catch (error) {
    console.log(error)
  }
}

demo()

