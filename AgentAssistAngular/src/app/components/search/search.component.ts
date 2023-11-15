import { Component, OnInit } from '@angular/core';
import { EVENTS } from 'src/app/helpers/events';
import { HandleSubjectService } from 'src/app/services/handle-subject.service';
import { RootService } from 'src/app/services/root.service';
import { ServiceInvokerService } from 'src/app/services/service-invoker.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  subs = new SubSink();
  searchText: string = '';
  searchedResultData: any = {};

  searchResponse: any = {};
  answerPlaceableIDs: any = [];

  faqViewCount: number;
  articleViewCount: number;
  snippetViewCount: number;
  faqAllView: boolean = false;
  articleAllView: boolean = false;
  snippetAllView: boolean = false;

  searchResultText: string;
  querySuggestions: any = [];


  constructor(private rootService: RootService, private serviceInvoker: ServiceInvokerService,
    private websocketService: WebSocketService, private handleSubjectService: HandleSubjectService) {

  }

  ngOnInit(): void {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.subs.sink = this.websocketService.agentAssistAgentResponse$.subscribe((agentResponse: any) => {
      if (agentResponse && agentResponse.isSearch) {
        // if (agentResponse.suggestions) {
        //   agentResponse.suggestions = {
        //     "dialogs": [
        //       {
        //         "name": "Pizza"
        //       }
        //     ],
        //     "faqs": [
        //       {
        //         "question": "Wanna know anything about pizza ?",
        //         "displayName": "Wanna know anything about pizza ?"
        //       },
        //       {
        //         "question": "Who are the other top pizza makers in the world?",
        //         "displayName": "Who are the other top pizza makers in the world?"
        //       },
        //       {
        //         "question": "what is a pizza crust?",
        //         "displayName": "what is a pizza crust?",
        //         "answer": [
        //           "The bottom of the pizza, called the &quot;crust&quot;, may vary widely according to style – thin as in a typical hand-tossed Neapolitan pizza or thick as in a deep-dish Chicago-style. It is traditionally plain, but may also be seasoned with garlic or herbs, or stuffed with cheese. The outer edge of the pizza is sometimes referred to as the cornicione.[40] Some pizza dough contains sugar, to help its yeast rise and enhance browning of the crust.[41]\r\n\r\nDipping sauce specifically for pizza was invented by American pizza chain Papa John's Pizza in 1984 and has since been adopted by some when eating pizza, especially the crust.[42]",
        //           "This is second answer"
        //         ]
        //       }
        //     ],
        //     "searchassist": {
        //       "confluencecloud": [
        //         {
        //           "content": "<span class=\"highlightText\">Pizza</span> for breakfastBut it was in late 18th-century Naples that the <span class=\"highlightText\">pizza</span> as we now know it came into being. Under the Bourbon kings, Naples had become one of the largest cities in Europe – and it was growing fast. Fuelled by overseas trade and a steady influx of peasants from the countryside, its population ballooned from 200,000 in 1700 to 399,000 in 1748. As the urban economy struggled to keep pace, an ever greater number of the city’s inhabitants fell into poverty. The most abject of these were known as lazzaroni, because their ragged appearance resembled that of Lazarus. Numbering around 50,000 they scraped by on the pittance they earned as porters, messengers or casual labourers. Always rushing about in search of work, they needed food that was cheap and easy to eat. <span class=\"highlightText\">Pizzas</span> met this need. Sold not in shops, but by street vendors carrying huge boxes under their arms, they would be cut to meet the customer’s budget or appetite. As Alexandre Dumas noted in Le Corricolo (1843), a two liard slice would make a good breakfast, while two sous would buy a pizza large enough for a whole family. None of them were terribly complicated. Though similar in some respects to Virgil’s flatbreads, they were now defined by inexpensive, easy-to-find ingredients with plenty of flavour. The simplest were topped with nothing more than garlic, lard and salt. But others included caciocavallo (a cheese made from horse’s milk), cecenielli (whitebait) or basil. Some even had tomatoes on top. Only recently introduced from the Americas, these were still a curiosity, looked down upon by contemporary gourmets. But it was their unpopularity – and hence their low price – that made them attractive.For a long time, pizzas were scorned by food writers. Associated with the crushing poverty of the lazzaroni, they were frequently denigrated as ‘disgusting’, especially by foreign visitors. In 1831, Samuel Morse – inventor of the telegraph – described pizza as a ‘species of the most nauseating cake … covered over with slices of pomodoro or tomatoes, and sprinkled with little fish and black pepper and I know not what other ingredients, it altogether looks like a piece of bread that has been taken reeking out of the sewer’.When the first cookbooks appeared in the late 19th century, they pointedly ignored pizza. Even those dedicated to Neapolitan cuisine disdained to mention it – despite the fact that the gradual improvement in the lazzaroni’s status had prompted the appearance of the first pizza restaurants.",
        //           "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6258796",
        //           "title": "Pizza for breakfast",
        //           "confluenceCloud_type": "page",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fmadhavkb2.atlassian.net%2Fwiki%2Fspaces%2FM2%2Fpages%2F6258796%2FPizza%2Bfor%2Bbreakfast&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6258796&hId=dc952bf5ab04feca62ce54f831dc17aac94551f3d7876e5d3962eada472b0777"
        //         },
        //         {
        //           "content": "Welcome to your team space!Here are a few suggestions to get started:Explain how your team should use this space by selecting the ✏️ Edit button and customizing this Overview pageSelect Create ⤴ to make a new page in your spaceAdd links to tools, guides, and other team resourcesBookmark our guide to learn how to build Confluence spaces for any teamExplore the sample pages we&#x27;ve created for youTeam homepage Weekly meeting notes Brainstorming🗑 Remove this panel once you&#x27;re ready to share your space with team members. 🎽 TeamType &#x2F;USERPROFILE or @ mention people to add your team.ℹ️ OverviewIntroduce your team and describe your team goals and objectives.📣 Team newsDisplay a stream of blog posts and share updates with your team by typing &#x2F;BLOG. To create a blog post, click Create ⤴ and then select the Blog post template.🕑 Recently updatedYou&#x27;ll see the 5 most recently updated pages that you and your team create. <span class=\"highlightText\">Pizza</span> for breakfast Dec 02, 2022 • contributed by Bindu Madhav k History of pizza Dec 02, 2022 • contributed by Bindu Madhav k Variations of pizza Dec 02, 2022 • contributed by Bindu Madhav k Pizza Dec 02, 2022 • contributed by Bindu Madhav k Fighting Illegitimate Disputes Dec 02, 2022 • contributed by Bindu Madhav k Show More",
        //           "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_196693",
        //           "title": "madhavkb 2",
        //           "confluenceCloud_type": "page",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fmadhavkb2.atlassian.net%2Fwiki%2Fspaces%2FM2%2Foverview&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_196693&hId=1557ba7e7b120e0fdefa893b4fe144ced7eae75ab108c4c4c416b1e1bbaf9d89"
        //         },
        //         {
        //           "content": "A History of PizzaThe world’s most popular fast food has ancient roots, but it was a royal seal of approval that set it on the path to global domination.Alexander Lee | Published in History Today Volume 68 Issue 7 July 2018Fast food outlet: a Neapolitan <span class=\"highlightText\">pizza</span> seller, 19th century.Pizza is the world’s favourite fast food. We eat it everywhere – at home, in restaurants, on street corners. Some three billion <span class=\"highlightText\">pizzas</span> are sold each year in the United States alone, an average of 46 slices per person. But the story of how the humble <span class=\"highlightText\">pizza</span> came to enjoy such global dominance reveals much about the history of migration, economics and technological change.People have been eating <span class=\"highlightText\">pizza</span>, in one form or another, for centuries. As far back as antiquity, pieces of flatbread, topped with savouries, served as a simple and tasty meal for those who could not afford plates, or who were on the go. These early <span class=\"highlightText\">pizzas</span> appear in Virgil’s Aeneid. Shortly after arriving in Latium, Aeneas and his crew sat down beneath a tree and laid out ‘thin wheaten cakes as platters for their meal’. They then scattered them with mushrooms and herbs they had found in the woods and guzzled them down, crust and all, prompting Aeneas’ son Ascanius to exclaim: “Look! We’ve even eaten our plates!”",
        //           "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6258789",
        //           "title": "History of pizza",
        //           "confluenceCloud_type": "page",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fmadhavkb2.atlassian.net%2Fwiki%2Fspaces%2FM2%2Fpages%2F6258789%2FHistory%2Bof%2Bpizza&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6258789&hId=0e989d23f111a0985d5fffdf1b381d6dbca8a21a040e997e8f43ee1bc045bf58"
        //         },
        //         {
        //           "content": "<span class=\"highlightText\">pizza</span>, dish of Italian origin consisting of a flattened disk of bread dough topped with some combination of olive oil, oregano, tomato, olives, mozzarella or other cheese, and many other ingredients, baked quickly—usually, in a commercial setting, using a wood-fired oven heated to a very high temperature—and served hot.One of the simplest and most traditional <span class=\"highlightText\">pizzas</span> is the Margherita, which is topped with tomatoes or tomato sauce, mozzarella, and basil. Popular legend relates that it was named for Queen Margherita, wife of Umberto I, who was said to have liked its mild fresh flavour and to have also noted that its topping colours—green, white, and red—were those of the Italian flag.",
        //           "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6324254",
        //           "title": "Pizza",
        //           "confluenceCloud_type": "page",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fmadhavkb2.atlassian.net%2Fwiki%2Fspaces%2FM2%2Fpages%2F6324254%2FPizza&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6324254&hId=c4e0902ab1fb8b4b36301a6e07481ca9924418f3b64390799d39aa4293398970"
        //         },
        //         {
        //           "content": "taly has many variations of <span class=\"highlightText\">pizza</span>. The Neapolitan <span class=\"highlightText\">pizza</span>, or Naples-style <span class=\"highlightText\">pizza</span>, is made specifically with buffalo mozzarella (produced from the milk of Italian Mediterranean buffalo) or fior di latte (mozzarella produced from the milk of prized Agerolese cows) and with San Marzano tomatoes or pomodorino vesuviano (a variety of grape tomato grown in Naples). Roman <span class=\"highlightText\">pizza</span> often omits tomatoes (an early 16th-century import) and uses onions and olives. The Ligurian <span class=\"highlightText\">pizza</span> resembles the pissaladière of Provence in France, adding anchovies to olives and onions. <span class=\"highlightText\">Pizza</span> has also spread from Italy throughout much of the rest of the world, and, in regions outside of Italy, the toppings used vary with the ingredients available and the flavour profile preferred.Uncover the chemistry behind the delicious taste of pizzaSee all videos for this articleThe popularity of <span class=\"highlightText\">pizza</span> in the United States began with the Italian community in New York City, where the Neapolitan <span class=\"highlightText\">pizza</span> had an early influence. The first pizzeria appeared in New York City about the turn of the 20th century. After World War II the pizza industry boomed. Soon there was scarcely a hamlet without a pizzeria. Sausage, bacon, ground beef, pepperoni, mushrooms, and peppers are traditional toppings familiar to many Americans, but ingredients as varied as arugula, pancetta, and truffles have found their way onto pizzas there. Variations are also often tied to different regions in the country, Chicago’s deep-dish pizza and California-style pizza among them.",
        //           "contentId": "sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6324261",
        //           "title": "Variations of pizza",
        //           "confluenceCloud_type": "page",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fmadhavkb2.atlassian.net%2Fwiki%2Fspaces%2FM2%2Fpages%2F6324261%2FVariations%2Bof%2Bpizza&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=sidx-785bfc5f-4d24-5e47-80de-bee9fbc7563c_6324261&hId=59dd075bb78e5815ce1f19adde24739e8b2f530df50453c0cf316de780555606"
        //         }
        //       ],
        //       "file": [
        //         {
        //           "contentId": "fc-cd844b59-339d-49f7-b987-960f6d89dbff",
        //           "file_image_url": "https://searchassist-pilot.kore.ai/home/assets/images/thumb-nails/pdf.png",
        //           "content": "Homemade PizzaQuick No-Cook <span class=\"highlightText\">Pizza</span> SauceIngredients:1 can (8 ounces) tomato sauce1 can (6 ounces) tomato paste1 teaspoon dried oregano1 teaspoon dried basil½ teaspoon garlic powder1 carrot, finely gratedDirections:1. Mix all ingredients together in a bowl.2. Spread ",
        //           "title": "Layout 1",
        //           "link": "https://searchassist-pilot.kore.ai/searchassistapi/redirect?rurl=https%3A%2F%2Fsearchassist-pilot.kore.ai%3A443%2Fsearchassistapi%2FgetMediaStream%2Ffindly%2Ff-a89c6a51-1b20-58d2-af88-e2a39104231c.pdf%3Fn%3D8103427235%26s%3DInJ1WjMxL0lvYW8wSS9kUDZLeTFQYjMzWGR1UWlwQlZEaldvTkg5TVlZK009Ig%24%24%23page%3D1&requestId=fsh-7176cc90-547a-5989-8ac0-8ca0c20034ab&contentId=fc-cd844b59-339d-49f7-b987-960f6d89dbff&hId=667dd906039dc27cc2e14b287182eafdee9bf349eea3d8f219d1ffd05b405f03"
        //         }
        //       ],
        //       "snippets": [
        //         {
        //           "title": "Pizza for breakfast",
        //           "content": "Pizza for breakfastBut it was in late 18th-century Naples that the pizza as we now know it came into being. Under the Bourbon kings Naples had become one of the largest cities in Europe and it was growing fast. Fuelled by overseas trade and a steady influx of peasants from the countryside its population ballooned from 200 000 in 1700 to 399 000 in 1748. As the urban economy struggled to keep pace an ever greater number of the city s inhabitants fell into poverty. The most abject of these were known as lazzaroni because their ragged appearance resembled that of Lazarus. Numbering around 50 000 they scraped by on the pittance they earned as porters messengers or casual labourers. Always rushing about in search of work they needed food that was cheap and easy to eat. Pizzas met this need. Sold not in shops but by street vendors carrying ...",
        //           "page_url": "https://madhavkb2.atlassian.net/wiki/spaces/M2/pages/6258796/Pizza+for+breakfast#:~:text=Pizza%20for%20breakfastBut%20it%20was%20in%20late%2018th%2Dcentury%20Naples%20that%20the%20pizza%20as%20we%20now%20know%20it%20came%20into%20being"
        //         }
        //       ]
        //     }
        //   }
        // }
        this.searchedResultData = agentResponse
        this.handleSearchResponse(agentResponse);
      }
    });
  }

  typeAHead = this.typeAHeadDeBounce((val, connectionDetails) => this.getAutoSearchApiResult(val, connectionDetails));
  onSearch(event: any) {
    if (this.searchText.length > 0) {
      this.typeAHead(this.searchText, this.rootService.connectionDetails);
    } else {
      this.searchResponse = {};
      this.handleSubjectService.setSearchResponse(this.searchResponse);
    }
    // else {
    //   this.filterSet = [];
    //   this.typeahead.emit('');
    // }

  }

  typeAHeadDeBounce(func, timeout = 300) {
    let delay;
    return function (...args) {
      clearTimeout(delay);
      delay = setTimeout(() => {
        func.apply(this, args);
      }, timeout)
    }
  }


  getAutoSearchApiResult(value, params) {
    // this.querySuggestions = [];
    const { botId, conversationId } = this.rootService.getConnectionDetails();
    let payload = {
      "query": value,
      "maxNumOfResults": 3,
      "lang": "en"
    }
    this.serviceInvoker.invoke('post.autoSearch', { botId: botId, convId: conversationId }, payload, { autoSearch: 'true', botId: botId }, params.agentassisturl).subscribe((res) => {
      console.log(res, 'res********from autho search');
      // res = {
      //   "originalQuery": "book",
      //   "querySuggestions": [
      //     "book ticket",
      //     "book flight",
      //     "Hotel Booking"
      //   ],
      //   "typeAheads": [
      //     "book flight",
      //     "booking",
      //     "book ticket"
      //   ]
      // }

      this.querySuggestions = res.querySuggestions;

    })
  }


  emitSearchRequest(value, isSearch) {
    let connectionDetails: any = Object.assign({}, this.rootService.connectionDetails);
    connectionDetails.value = value;
    connectionDetails.isSearch = isSearch;
    // connectionDetails.positionId = searchObj?.positionId;
    if (connectionDetails.interactiveLanguage && typeof connectionDetails.interactiveLanguage == 'string' && connectionDetails.interactiveLanguage != "''") {
      connectionDetails['language'] = connectionDetails.interactiveLanguage; // Return the default value for null, undefined, or "''"
    }
    let agent_assist_agent_request_params = this.rootService.prepareAgentAssistAgentRequestParams(connectionDetails);
    this.websocketService.emitEvents(EVENTS.agent_assist_agent_request, agent_assist_agent_request_params);
  }


  getSearchResults(event) {
    this.setValue(event.target.value, true)
  }

  setValue(value: any, isEntered = false) {
    this.searchText = value;
    // this.isCursorOverFilterSet = false;
    // this.hideList();
    if (isEntered) {
      this.emitSearchRequest(this.searchText, true)
    } else {
      // this.typeahead.emit(this.searchText);
    }

  }

  handleSearchResponse(response) {
    if (response && response.suggestions) {
      if (this.answerPlaceableIDs.length == 0) {
        this.searchResponse = {};
        // response.suggestions.faqs = [
        //   {question : "How does COVID -19 spread?", answer : ["Covid spreads through tiny virus particles that get inside the body. The most common way for covid to enter the body is by being breathed in from infected air. This can happen when people stand close togethe When a person breaths out, it’s not just air that leaves their nose or mouth. Tiny water droplets are also breathed out, and these can be infected with viruses like colds or covid. These water droplets can be breathed in by other people, or if they land on a surface that someone touches later, that person could catch coronavirus."]},
        //   {question : "Reset Password" , answer : ['to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click on to reset password click off', 'to change password on reset reset to reset password click on reset to reset password click on reset to reset password click on reset to reset password click on reset', 'to reset password click on reset', 'to change password click on reset']}
        // ]
        this.searchResponse = this.rootService.formatSearchResponse(response);
        this.searchResponse.totalSearchResults = (this.searchResponse.dialogs?.length + this.searchResponse.faqs?.length + this.searchResponse?.articles?.length + this.searchResponse?.snippets?.length || 0);
        this.faqViewCount = (this.searchResponse.faqs && this.searchResponse.faqs.length <= 2) ? this.searchResponse.faqs.length : 2;
        this.articleViewCount = (this.searchResponse.articles && this.searchResponse.articles.length <= 2) ? this.searchResponse.articles.length : 2;
        this.snippetViewCount = (this.searchResponse.snippets && this.searchResponse.snippets.length <= 2) ? this.searchResponse.snippets.length : 2;
        this.faqAllView = this.searchResponse.faqs && this.searchResponse.faqs.length > 2 ? true : false;
        this.articleAllView = this.searchResponse.articles && this.searchResponse.articles.length > 2 ? true : false;
        this.snippetAllView = this.searchResponse.snippets && this.searchResponse.snippets.length > 2 ? true : false;
        this.searchResultText = this.searchResponse.totalSearchResults == 1 ? "Search result for" : "Search results for";
        this.checkFaqAnswerNotRenderCountAndRequest()
      } else if (this.answerPlaceableIDs.length > 0) {
        console.log(response.suggestions, "response suggestions*****");
        
        response.suggestions.faqs = this.rootService.formatFAQResponse(response.suggestions.faqs);
        let faqAnswerIdsPlace = this.answerPlaceableIDs.find(ele => ele.input == response.suggestions?.faqs[0].question);
        console.log(faqAnswerIdsPlace, this.answerPlaceableIDs, response.suggestions.faq, 'answer placable ids');
        
        if (faqAnswerIdsPlace) {
          let accumulator = response.suggestions.faqs.reduce((acc, faq) => {
            if (faq.question == faqAnswerIdsPlace.input) {
              acc[faq.question] = faq;
              return acc;
            }
          }, {});
          console.log(accumulator, 'accumaltor');
          
          this.searchResponse.faqs.forEach(faq => {
            if (accumulator[faq.question] && accumulator[faq.question].answer) {
              faq.answer = accumulator[faq.question].answer;
              // this.updateFaqAmbiguity.emit(faq);
            }
          });
          let index = this.answerPlaceableIDs.indexOf(faqAnswerIdsPlace);
          this.answerPlaceableIDs.splice(index, 1);
          // setTimeout(() => {
          //   this.handleSeeMoreButton(this.searchResponse.faqs, this.projConstants.FAQ);
          // }, 1000);
        }
      }
      this.handleSubjectService.setSearchResponse(this.searchResponse);
    }
  }

  checkFaqAnswerNotRenderCountAndRequest() {
    let answerNotRenderendElements = (this.searchResponse.faqs || []).filter(faq => {
      return !faq.answer;
    });
    if (answerNotRenderendElements.length == 1) {
      this.getFaqAnswerAndtoggle(answerNotRenderendElements[0]);
    }
  }

  getFaqAnswerAndtoggle(faq) {
    faq.toggle = !faq.toggle;
    faq.seeMoreWrapper = false;
    this.checkAnswerAndToggle(faq);
  }

  checkAnswerAndToggle(faq){
    if (!faq.answer && faq.toggle) {
      this.answerPlaceableIDs.push({ input: faq.question });
      let searchObj: any = {};
      searchObj.value = faq.displayName;
      searchObj.question = faq.question;
      // searchObj.searchFrom = this.commonService.activeTab;
      this.emitSearchRequest(searchObj.value, false);
    }
  }
}
