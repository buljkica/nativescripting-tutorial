import { Component, OnInit } from "@angular/core";
import { User } from "~/app/shared/user/user";
import { UserService } from "~/app/shared/user/user.service";
import { Router } from "@angular/router";

import { Page } from "tns-core-modules/ui/page";

@Component({
    selector: 'gr-main',
    providers: [UserService],
    templateUrl: 'app/pages/login/login.component.html',
    styleUrls: ['app/pages/login/login-common.css', 'app/pages/login/login.css']
})
export class LoginComponent implements OnInit {

    public user: User;
    public isLoggingIn = true;

    constructor(private router: Router,
        private userService: UserService,
        private page: Page
    ) {
        this.user = new User();
        this.user.email = 'v.v@v.v';
        this.user.password = 'pass';
    }

    ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.page.backgroundImage = 'res://bg_login';
    }

    public submit() {
        if (this.isLoggingIn) {
            this.login();
        } else {
            this.signUp();
        }
    }

    private signUp() {
        this.userService.register(this.user)
            .subscribe(
                () => {
                    alert('Your account has been successfully created.');
                    this.toggleDisplay();
                },
                () => alert('Unfortunately we were unable to create your account.')
            );
    }

    private login() {
        this.userService.login(this.user)
            .subscribe(
                () => this.router.navigate(['/list']),
                (error) => alert('Unfortunatelly we couldn\'t find your account!')
            );
    }

    public toggleDisplay() {
        this.isLoggingIn = !this.isLoggingIn;
    }
}