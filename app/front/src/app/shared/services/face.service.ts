import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

 
@Injectable()
export class FaceService {

    private backend = `${environment.domain_back}`;
    
    constructor(private _http: InterceptorService) { 
        
    }
 
    add(face: FormData) : Observable<any>{
        
        return this._http.post(`${this.backend}/api/public/face/person`, face)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    getAzureFaceId(face: FormData) : Observable<any>{
        
        return this._http.post(`${this.backend}/api/public/face/detect`, face)
            .map((response: Response) => response.json())
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    rotateImage(file, callback) {
        var fileTracker = new FileReader;
        fileTracker.readAsDataURL(file);
    
        var that = this;
        fileTracker.onloadend = function() {
    
            var imageResize =this.result;
            that.getOrientation(imageResize, function(orientation) {
    
                var img = new Image();    
                
                    img.onload = function() {
    
    
                    var width = img.width,
                        height = img.height,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                        canvas['id']='canvas';
                        canvas['name']='canvas';
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        canvas.width = img.width;
                        canvas.height = img.height;
            
                        
                        // set proper canvas dimensions before transform & export
                        if (4 < orientation && orientation < 9) {
                        canvas.width = height;
                        canvas.height = width;
                        } else {
                        canvas.width = width;
                        canvas.height = height;
                        }
                    
                        // transform context before drawing image
                        switch (orientation) {
                            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
                            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
                            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
                            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
                            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                            default: break;
                        }
                        ctx.drawImage(img, 0, 0);
                        var blobBin = atob(canvas.toDataURL('image/jpeg',0.8).split(',')[1]);
                        var array = [];
                        for(var i = 0; i < blobBin.length; i++) {
                            array.push(blobBin.charCodeAt(i));
                        }
                        var fileRotated=new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                        callback(null, fileRotated);
                    };
                    
                    img.src = imageResize;
                });
        };
        fileTracker.onabort = function() {
            callback(new Error('The upload was aborted.'));
            
        }
        fileTracker.onerror = function() {
            callback(new Error('An error occured while reading the file.'));
        }
    
    
    }


    getOrientation(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
    
        var view = new DataView(e.target['result']);
        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        var length = view.byteLength, offset = 2;
        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
            var little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;
            for (var i = 0; i < tags; i++)
                if (view.getUint16(offset + (i * 12), little) == 0x0112)
                return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
            else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        return callback(-1);
        };
        var blobBin = atob(file.split(',')[1]);
        var array = [];
        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var fileResize=new Blob([new Uint8Array(array)], {type: 'image/jpeg'});

        reader.readAsArrayBuffer(fileResize);
    }

    resizeImage (file, size, callback){
        var fileTracker = new FileReader;
        fileTracker.readAsDataURL(file);
    
        fileTracker.onloadend = function() {
    
                var image = new Image();
                image.onload = function(){
                    
                    var canvas = document.createElement('canvas');
                    canvas['id']='canvas';
                    canvas['name']='canvas';
                    /*
                    if(image.height > size) {
                        image.width *= size / image.height;
                        image.height = size;
                    }
                    */
                    if(image.width > size) {
                        image.height *= size / image.width;
                        image.width = size;
                    }
                    var ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    var blobBin = atob(canvas.toDataURL('image/jpeg',0.8).split(',')[1]);
                    var array = [];
                    for(var i = 0; i < blobBin.length; i++) {
                        array.push(blobBin.charCodeAt(i));
                    }
                    var fileResized=new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
                    callback(null, fileResized);
                };
                image.src = this.result;
        };
        fileTracker.onabort = function() {
            callback(new Error('The upload was aborted.'));
        }
        fileTracker.onerror = function() {
            callback(new Error('An error occured while reading the file.'));
        }
        
    
    }
 


}