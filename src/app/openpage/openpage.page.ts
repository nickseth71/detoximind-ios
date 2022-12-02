import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomloaderService } from '../services/customloader.service';
import { PagesService } from '../services/page.service';

@Component({
  selector: 'app-openpage',
  templateUrl: './openpage.page.html',
  styleUrls: ['./openpage.page.scss'],
})
export class OpenpagePage implements OnInit {
  id: any;
  All_data: any;
  constructor(
    private route: ActivatedRoute,
    public loader_cust: CustomloaderService,
    private pages_service: PagesService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadingData()
  }


  async loadingData() {
    const loading = await this.loader_cust.showLoader();
    this.pages_service.getPagesData(this.id).subscribe(async item => {
      this.All_data = await item;
      await this.loader_cust.hideLoader(loading);
    }, async err => {
      await this.loader_cust.hideLoader(loading);
    })
  }

}
