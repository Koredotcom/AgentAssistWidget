import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private openai: OpenAIApi;
  configuration = new Configuration({
    apiKey: "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",
  });

  constructor() {
    this.openai = new OpenAIApi(this.configuration);
    console.log("openai constructor")
  }

  generateText(prompt: string, type: string): Promise<string | undefined> {
    return this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: OpenAIPreText[type] + '\n' + prompt,
      max_tokens: 256
    }).then(response => {
      return response.data.choices[0].text;
    }).catch(error => {
      console.error(error)
      return '';
    });
  }
}

export enum OpenAIPreText {
  friendly = 'Assume you are a contact center agent who’s replying to a customer. You have the following response drafted and you want to change the language so that the prompt sounds friendlier. Please rephrase the following response keeping the above in mind.',
  formal = 'generate multiple similar meaning sentences',
  expand = 'Assume you are a contact center agent who’s replying to a customer. You have a short response drafted and you want to generate a more verbose response. Please rephrase the following response keeping the above in mind.',
}
