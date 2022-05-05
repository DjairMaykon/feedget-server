import { SubmitFeedbackUseCase } from "./submit-feedback-use-case";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn();

describe("Submit Feedback", () => {
  it("should be able to submit a feedback", async () => {
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      { create: createFeedbackSpy },
      { sendMail: sendMailSpy }
    );

    const reqMock = {
      type: "test",
      comment: "test",
      screenshot: "data:image/png;base64dfasdfa",
    };

    await expect(submitFeedbackUseCase.execute(reqMock)).resolves.not.toThrow();

    expect(createFeedbackSpy).toBeCalledWith(reqMock);
    expect(sendMailSpy).toBeCalledWith({
      subject: "Novo Feedback",
      body: [
        `<div class="font-family: sans-serif; font-size: 16px; color: #111;">`,
        `<p>Tipo do feedback: ${reqMock.type}</p>`,
        `<p>Comentário: ${reqMock.comment}</p>`,
        `</div>`,
      ].join("\n"),
    });
  });
  it("should not be able to submit a feedback without type", async () => {
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      { create: async () => {} },
      { sendMail: async () => {} }
    );

    await expect(
      submitFeedbackUseCase.execute({
        type: "",
        comment: "test",
        screenshot: "data:image/png;base64dfasdfa",
      })
    ).rejects.toThrow();
  });
  it("should not be able to submit a feedback without comment", async () => {
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      { create: async () => {} },
      { sendMail: async () => {} }
    );

    await expect(
      submitFeedbackUseCase.execute({
        type: "test",
        comment: "",
        screenshot: "data:image/png;base64dfasdfa",
      })
    ).rejects.toThrow();
  });
  it("should not be able to submit a feedback with an invalid screenshot", async () => {
    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      { create: async () => {} },
      { sendMail: async () => {} }
    );

    await expect(
      submitFeedbackUseCase.execute({
        type: "test",
        comment: "test",
        screenshot: "test",
      })
    ).rejects.toThrow();
  });
});
