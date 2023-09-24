import { Elysia, t } from "elysia";

const app = new Elysia();

type Stuff = {
  stuff: string;
  attributes: any;
};
const aListOfStuffs: Stuff[] = [
  { stuff: "cadabra", attributes: { baz: "foo" } },
  { stuff: "abba", attributes: { foo: "bar" } },
];
const getStuffByStuff = (stuff: string) =>
  aListOfStuffs.find((thing) => thing.stuff === stuff);

app
  .get("/stuff/:stuff", ({ params: { stuff } }) => getStuffByStuff(stuff))
  .get("/ping", () => "pong")
  .get("/*", () => "Howdy")
  .post(
    "/stuff",
    ({ body, set }) => {
      if (getStuffByStuff(body.stuff)) {
        set.status = 409;
        return "This stuff already exists";
      }
      aListOfStuffs.push(body);
      set.status = 200;
      return aListOfStuffs;
    },
    {
      body: t.Object({
        stuff: t.String(),
        attributes: t.Any(),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
