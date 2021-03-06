import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
  public router: Router) {
    console.log('Servicio listo para ser usado');
    this.cargarStorage();
  }

  crearUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + '/usuario';
    return this.http.post (url, usuario)
    .map((resp: any) => {
      Swal('Usuario creado', usuario.email, 'success');
      return resp.usuario;
    });
  }

  guardarStorage (id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  estaLogeado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle (token: string) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post( url, {token})
    .map ((res: any) => {
      this.guardarStorage(res.id, res.token, res.usuario);
      return true;
    });
  }

  login ( usuario, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = URL_SERVICIOS + '/login';

    return this.http.post (url, usuario)
    .map ((res: any) => {
        this.guardarStorage(res.id, res.token, res.usuario);
        return true;
    });
  }

}
