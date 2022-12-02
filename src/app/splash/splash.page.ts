import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit, AfterViewInit {
  hideDiv = true;
  constructor(
    private animationCtrl: AnimationController,
    public router: Router
  ) {
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    let squareC = this.animationCtrl.create()
      .addElement(document.querySelector('.img_wrapper'))
      .duration(3000)
      .fromTo('opacity', '0.0', '2');
    squareC.play();
    let squareD1 = this.animationCtrl.create()
      .addElement(document.querySelector('.waveTextAnimated'))
      .duration(5000)
      .keyframes([
        { offset: 0, transform: 'translateX(-300px)', opacity: '0.5' },
        { offset: 0.1, transform: 'translateX(-20px)', opacity: '2' },
        { offset: .2, transform: 'translateX(10px)', opacity: '2' },
        { offset: .3, transform: 'translateX(30px)', opacity: '2' },
        { offset: .4, transform: 'translateX(50px)', opacity: '2' },
        { offset: .5, transform: 'translateX(70px)', opacity: '2' },
        { offset: .6, transform: 'translateX(90px)', opacity: '2' },
        { offset: .7, transform: 'translateX(110px)', opacity: '2' },
        { offset: .8, transform: 'translateX(130px)', opacity: '2' },
        { offset: .9, transform: 'translateX(150px)', opacity: '2' },
        { offset: 1.0, transform: 'translateX(400px)', opacity: '2' },
      ]);
    let squareD2 = this.animationCtrl.create()
      .addElement(document.querySelector('.waveTextAnimated'))
      .duration(4000)
      .keyframes([
        { offset: 0, transform: 'translateX(-100px)', opacity: '2' },
        { offset: .5, transform: 'translateX(10px)', opacity: '2' },
      ]);

    let squareD3 = this.animationCtrl.create()
      .addElement(document.querySelector('.waveTextAnimated'))
      .duration(1000)
      .keyframes([
        { offset: 0, transform: 'translateX(20px)', opacity: '2' },
        { offset: 1, transform: 'translateX(400px)', opacity: '2' },
      ]);

    setTimeout(() => {
      let squareA = this.animationCtrl.create()
        .addElement(document.querySelector('.animate_text'))
        .duration(1500)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '2  ', transform: 'scale(1.5)' },
        ]);
      let squareB = this.animationCtrl.create()
        .addElement(document.querySelector('.animate_text'))
        .duration(1500)
        .keyframes([
          { offset: 0, transform: 'translateY(0px)', opacity: '0.5' },
          { offset: 0.5, transform: 'translateY(40px)', opacity: '1' },
          { offset: 1, transform: 'translateY(20px)', opacity: '2' }
        ]);
      squareA.play();
      setTimeout(async () => {
        await squareB.play();
        this.hideDiv = false;

        await squareD1.play();
        await this.router.navigate(['/home']);
      }, 1000)
    }, 1000)
  }


}
