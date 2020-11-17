import {Component, OnInit} from '@angular/core';
import {CheckOutService} from "../../services/check-out.service";
import {StepOption} from "../../models/step.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  constructor(private router: Router, private checkOutService: CheckOutService) {
  }

  ngOnInit(): void {
  }

}
