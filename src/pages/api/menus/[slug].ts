import type { APIRoute } from "astro";
import { getSafeMongoErrorDetails } from "../../../lib/mongodb";
import { getPublishedMenu } from "../../../services/menu.service";

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ message: "Menú no encontrado." }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const menu = await getPublishedMenu(slug);

    if (!menu) {
      return new Response(JSON.stringify({ message: "Menú no encontrado." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(menu), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[menu-api]", getSafeMongoErrorDetails(error));

    return new Response(JSON.stringify({ message: "No fue posible consultar el menú." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
