import { makeSchema } from "nexus"
import { join } from "path"
import * as types from "./types"

export const schema = makeSchema({
    types : types,
    outputs : {
        typegen : join(
            process.cwd(),
            "node_modules",
            "@types",
            "nexus-typegen.ts",
            "index.d.ts",
        ),
        schema : join(process.cwd(), "schema.graphql"),
    },
    contextType: {
        export : "Context",
        module: join(process.cwd(), "graphql", "context.ts"),
    }
})