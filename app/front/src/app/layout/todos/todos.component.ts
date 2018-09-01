import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { TodosService } from './todos.service';
import { AlertService } from '../../shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-todos',
   templateUrl: './todos.component.html',
   styleUrls: ['./todos.component.scss'],
   animations: [routerTransition()]
})
export class TodosComponent implements OnInit {

   todos = [];
   todo: any = {};

   constructor(private todosService: TodosService,
      private alertService: AlertService,
      private modalService: NgbModal
   ) { }

   ngOnInit() {
      this.getUserTodos();
   }

   getUserTodos() {
      this.todosService.getMyTodos().subscribe(
         todos => {
            this.todos = todos;
         },
         err => {
            console.error(err);
         });
   }

   delete(id) {
      this.todosService.delete(id).subscribe(
         response => {
            this.alertService.success("To Do Deleted");
            this.getUserTodos();
         },
         err => {
            console.error(err);
            this.alertService.error(err.json().message);
         });
   }

   create() {
      this.todosService.create(this.todo).subscribe(
         response => {
            //console.log(response);
            this.alertService.success("To Do Created");
            this.todo = {};
            this.getUserTodos();
         },
         err => {
            console.error(err);
            this.alertService.error(err.json().message);
         });
   }


   open(content) {
      this.modalService.open(content).result.then(
         (result) => {
            this.create();
         }
      );
   }

}
