import express from "express";
import { NodeMailerMailAdapter } from "./adapters/nodeMailer/nodemailer-mail-adapter";
import { PrismaFeedbackRepository } from "./repositories/prisma/prisma-feedbacks-repository";
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback-use-case";

export const routes = express.Router();

routes.use(express.json());

routes.post("/feedback", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    new PrismaFeedbackRepository(),
    new NodeMailerMailAdapter()
  );

  await submitFeedbackUseCase.execute({ type, comment, screenshot });

  return res.status(201).send();
});
