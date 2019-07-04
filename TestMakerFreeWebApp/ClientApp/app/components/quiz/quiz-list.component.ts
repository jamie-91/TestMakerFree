import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "quiz-list",
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})

export class QuizListComponent {
    title: string;
    selectedQuiz: Quiz;
    quizzes: Quiz[];

    constructor(http: HttpClient,
        @Inject('BASE_URL') baseUrl: string) {
        this.title = "Latest Quizzes";
        var url = baseUrl + "api/quiz/Latest/";

        console.log(url);

        http.get<Quiz[]>(url).subscribe(result => {
            this.quizzes = result;
        }, error => console.error(error));
    }

    onSelect(quiz: Quiz) {
        this.selectedQuiz = quiz;
        console.log("quiz with Id "
            + this.selectedQuiz.Id
            + " has been selected.");
    }
}