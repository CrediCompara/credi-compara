import { Component, OnInit } from '@angular/core';
import {MortgageCredit} from "../../models/mortgage-credit";
import {UserApiService} from "../../services/user-api.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {
  dataSourceList : MortgageCredit[] = [];
  assetstList: string[] = [];
  classList: string[] = [];
  scotia_img: string = "../../../assets/images/scotia.png";
  interb_img: string = "../../../assets/images/interb.jpg";
  constructor(private userApi: UserApiService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.getAllStaff();
  }
  getAllStaff() {
    this.userApi.getMortgageCreditsByUserId(this.tokenStorageService.getUser().id).subscribe((data:MortgageCredit[]) => {
      this.dataSourceList = data;
    });
  }
  deleteMortageFromFavorite(index: number) {
    this.userApi.deleteMortgageCreditByUserId(this.dataSourceList[index].id).subscribe(res => {
      window.location.reload();
    });
  }

}
