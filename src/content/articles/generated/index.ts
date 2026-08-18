import type { Article } from "../types";
import { generatedGlobalArticles } from "./global";
import { generatedAuArticles } from "./au";
import { generatedUkArticles } from "./uk";

export const generatedArticles: Article[] = [
  ...generatedGlobalArticles,
  ...generatedAuArticles,
  ...generatedUkArticles,
];
