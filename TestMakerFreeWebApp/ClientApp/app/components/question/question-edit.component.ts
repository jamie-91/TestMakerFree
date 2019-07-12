import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "question-edit",
    templateUrl: './question-edit.component.html',
    styleUrls: ['./question-edit.component.css']
})

export class QuestionEditComponent {
    title: string;
    question: Question;
    form: FormGroup;

    // this will be TRUE when editing an existing question, 
    // FALSE when creating a new one.
    editMode: boolean;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private fb: FormBuilder,
        @Inject('BASE_URL') private baseUrl: string) {

        // create an empty object from the Quiz interface
        this.question = <Question>{};

        // initialize the form
        this.createForm();

        var id = +this.activatedRoute.snapshot.params["id"];

        // check if we're in edit mode or not
        this.editMode = (this.activatedRoute.snapshot.url[1].path === "edit");

        if (this.editMode) {

            // fetch the quiz from the server
            var url = this.baseUrl + "api/question/" + id;
            this.http.get<Question>(url).subscribe(res => {
                this.question = res;
                this.title = "Edit - " + this.question.Text;

                // update the form with the quiz value
                this.updateForm();

            }, error => console.error(error));
        }
        else {
            this.question.QuizId = id;
            this.title = "Create a new Question";
        }
    }

    createForm() {
        this.form = this.fb.group({
            Text: ['', Validators.required]
        });
    }

    updateForm() {
        this.form.setValue({
            Text: this.question.Text
        });
    }

    // retrieve a FormControl
    getFormControl(name: string) {
        return this.form.get(name);
    }

    // returns TRUE if the FormControl is valid
    isValid(name: string) {
        var e = this.getFormControl(name);
        return e && e.valid;
    }

    // returns TRUE if the FormControl has been changed
    isChanged(name: string) {
        var e = this.getFormControl(name);
        return e && (e.dirty || e.touched);
    }

    // returns TRUE if the FormControl is invalid after user changes
    hasError(name: string) {
        var e = this.getFormControl(name);
        return e && (e.dirty || e.touched) && !e.valid;
    }

    onSubmit() {
        var url = this.baseUrl + "api/question";

        // build a temporary question object from form values
        var tempQuestion = <Question>{};
        tempQuestion.Text = this.form.value.Text;
        tempQuestion.QuizId = this.question.QuizId;

        if (this.editMode) {
            tempQuestion.Id = this.question.Id;

            this.http
                .post<Question>(url, tempQuestion)
                .subscribe(res => {
                    var v = res;
                    console.log("Question " + v.Id + " has been updated.");
                    this.router.navigate(["quiz/edit", v.QuizId]);
                }, error => console.log(error));
        }
        else {
            this.http
                .put<Question>(url, tempQuestion)
                .subscribe(res => {
                    var v = res;
                    console.log("Question " + v.Id + " has been created.");
                    this.router.navigate(["quiz/edit", v.QuizId]);
                }, error => console.log(error));
        }
    }

    onBack() {
        this.router.navigate(["quiz/edit", this.question.QuizId]);
    }
}