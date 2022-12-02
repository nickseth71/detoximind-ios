import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { CustomloaderService } from '../services/customloader.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  id: any;
  post_data_all: any;
  constructor(
    private route: ActivatedRoute,
    private post: PostService,
    public loader_cust: CustomloaderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.fetchData();
  }

  async fetchData() {
    const loading = await this.loader_cust.showLoader();

    this.post.getOnlyOnePost(this.id).subscribe(async post => {
      this.post_data_all = post;
      await this.loader_cust.hideLoader(loading);
    }, async error => {
      await this.loader_cust.hideLoader(loading);
    });
  }

}
