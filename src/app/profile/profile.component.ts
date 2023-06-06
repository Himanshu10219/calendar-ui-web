import { Component, ElementRef, VERSION, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageHelper } from '@helper/storage.helper';
import { StringHelper } from '@helper/string.helper';
import { UserModel } from '@model/usermodel';
import { UserApiService } from '@service/user.service';
import { Country, State, City } from 'country-state-city';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(private userApiService: UserApiService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.user = StorageHelper.getUserID() == null;
    this.profile = sessionStorage.getItem('userProfile');
    if (StorageHelper.getUserID() != null) {
      const user = await this.userApiService.getAllUsersAPI({
        userID: StorageHelper.getUserID()!,
      });
      if (user != null) {
        this.firstName = user.data[0]['firstName'].toString();
        this.lastName = user.data[0]['lastName'].toString();
        this.email = user.data[0]['email'].toString();
        this.phonenumber = user.data[0]['mobile'].toString();
        this.id = user.data[0]['id'].toString();
        this.dateofbirth = user.data[0]['dob'].toString();
        if (!StringHelper.isNullorEmpty(user.data[0]['country'].toString())) {
          this.selectedCountry = this.countries.find(
            (country: any) =>
              country.name === user.data[0]['country'].toString()
          );
          console.log(this.selectedCountry.name);
          this.onCountryChange(
            null,
            user.data[0]['state'].toString(),
            user.data[0]['city'].toString()
          );
        }
      }
    }
  }

  @ViewChild('country')
  country!: ElementRef;
  @ViewChild('city')
  city!: ElementRef;
  @ViewChild('state')
  state!: ElementRef;

  user: any;
  firstName: any = '';
  id: any = '';
  lastName: any = '';
  phonenumber: any = '';
  email: any = '';
  profile: any = '';
  dateofbirth: any = '';

  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  countries = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  onCountryChange($event: any, stateVal: string, city: string): void {
    if (!StringHelper.isNullorEmpty(stateVal)) {
      const countryCode = this.selectedCountry.isoCode;
      this.states = State.getStatesOfCountry(countryCode);
      this.selectedState = this.states.find(
        (state: { name: string }) => state.name === stateVal
      );
      this.onStateChange(null, city);
    } else {
      this.states = State.getStatesOfCountry(this.selectedCountry.isoCode);
      this.selectedState = null;
      this.cities = null;
      this.onStateChange(null, '');
    }
  }

  onStateChange($event: any, cityVal: string): void {
    if (!StringHelper.isNullorEmpty(cityVal)) {
      const stateCode = this.selectedState.isoCode;
      this.cities = City.getCitiesOfState(
        this.selectedCountry.isoCode,
        stateCode
      );
      this.selectedCity = this.cities.find(
        (city: { name: string }) => city.name === cityVal
      );
    } else {
      console.log('state', this.selectedState.name);
      if (this.selectedState) {
        this.cities = City.getCitiesOfState(
          this.selectedCountry.isoCode,
          this.selectedState.isoCode
        );
      } else {
        this.cities = null;
      }
      this.selectedCity = null;
    }
  }

  onCityChange($event: any): void {
    this.selectedCity = JSON.parse(this.city.nativeElement.value);
  }

  async saveProfile() {
    let updateUser: UserModel = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,

      password: '',
      dob: this.dateofbirth,
      city: this.selectedCity,
      state: this.selectedState,
      country: this.selectedCountry,
      mobile: this.phonenumber,
    };
    let newUser: UserModel = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      deviceToken: StorageHelper.getDeviceToken(),
      mobile: this.phonenumber,
      city: this.selectedCity.name,
      state: this.selectedState.name,
      country: this.selectedCountry.name,
      dob: this.dateofbirth,
    };
    console.log('newUser', newUser);

    if (StorageHelper.getUserID() != null) {
      const user = await this.userApiService.updateUserAPI(newUser);
      console.log('user', user);
      if (user != null) {
        Swal.fire({
          icon: 'success',
          title: 'Your Profile has beed updated !',
          showConfirmButton: true,
          confirmButtonText: 'OK',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.router.navigate(['']);
          }
        });
      }
    }
  }
}
