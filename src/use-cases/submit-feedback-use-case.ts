import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbackRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbackRepository: FeedbackRepository,
    private mailAdapter: MailAdapter
  ) {
    this.feedbackRepository = feedbackRepository;
    this.mailAdapter = mailAdapter;
  }

  async execute({ type, comment, screenshot }: SubmitFeedbackUseCaseRequest) {
    if (!type) {
      throw new Error("Type is required");
    }
    if (!comment) {
      throw new Error("Comment is required");
    }
    if (screenshot && !screenshot.startsWith("data:image/png;base64")) {
      throw new Error("Invalid screenshot format.");
    }

    await this.feedbackRepository.create({ type, comment, screenshot });
    await this.mailAdapter.sendMail({
      subject: "Novo Feedback",
      body: [
        `<div class="font-family: sans-serif; font-size: 16px; color: #111;">`,
        `<p>Tipo do feedback: ${type}</p>`,
        `<p>Comentário: ${comment}</p>`,
        screenshot ? `<img src="${screenshot}" />` : null,
        `</div>`,
      ].join("\n"),
    });
  }
}
