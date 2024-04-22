import { Callback } from "typeorm";

export default class ListaCorp<T>{
    private _elementos:T[]
    private _headers:object
    constructor(lista1?:T[]){
        if(lista1!==undefined){
            this._elementos = lista1.map(item=>item)
        }else this._elementos = new Array();
        this._headers = {};
    }

    get elementos():T[]{
        return this._elementos;
    }
    
    get headers():object{
        return this._headers;
    }

    set addHeader(obj:object){
        this._headers = {...this._headers, ...obj}
    }

    set removeHeader(key:string){
        delete this._headers[key];
    }

    set elementos(nueva){
        this._elementos = nueva.map(item=>item);
    }

    private quick(array:T[], compare:Function):T[] {
        if (array.length <= 1) {
          return array;
        }
        const pivot = array[0];
        const left = []; 
        const right = []
        for (var i = 1; i < array.length; i++) {
          compare(array[i], pivot)===true? left.push(array[i]) : right.push(array[i]);
        }
        return this.quick(left,compare).concat(array[0], this.quick(right, compare));
    };

    selectSort(compare:Function){
        const sorted = this._elementos.map(item=>item);
        let i:number, j:number, minIndex:number, end=sorted.length;
        for(i=0; i<end; i++){
            minIndex = i;
            for(j=i+1; j<end; j++){
                if(compare(sorted[j], sorted[minIndex]))
                minIndex = j;
            }
            if (minIndex != i){
                const saved = sorted[minIndex];
                sorted[minIndex] = sorted[i];
                sorted[i] = saved;
            }
        }
        this._elementos = sorted;
        return this;
    }

    quickSort(compare:Function){
        this._elementos = this.quick(this._elementos,compare)
        return this;
    }

    fusion(arreglo:T[], compare:Function){
        const end = arreglo.length;
        const end2 = this._elementos.length;
        for(let i=0; i<end; i++){
            let repetida = false;
            let j=0;
            for(j; j<end2; j++){
                if(compare(this._elementos[j], arreglo[i])===true){
                    repetida=true;
                    break;
                }
            }
            if(repetida===false)this._elementos.push(arreglo[i]);
        }
        return this;
    }

    filter(compareBY:Function){
        this._elementos = this._elementos.filter(item=>{
            return compareBY(item)
        });
        return this;
    }

    acumulate(fn:Function){
        let acum:number=0;
        this._elementos.forEach(item=>{
            const result:number = fn(item)
            acum += result
        });
        return acum;
    }

    findIndex(compareBY:Function){
        let index = -1;
        const end = this.elementos.length;
        for(let i=0;i<end; i++){
            if(compareBY(this.elementos[i])===true){
                index = i;
                break;
            }
        }
        return index;
    }

    retrive(compareBY:Function):T{
        const index = this.findIndex(compareBY)
        return index!==-1?this._elementos[index]:null;
    }

    apendizar(apendice, compareBY:Function){
        const index = this.findIndex(compareBY);
        if(index!==-1){
            this.elementos[index] = {
                ...this._elementos[index],
                ...apendice
            }
        }
    }

    push(elemento:T){
        this._elementos.push(elemento);
    }

    pushUnrepeat(elemento:T, compareBY:Function){
        const index = this.findIndex(compareBY)
        if(index===-1){
            this._elementos.push(elemento);
            return true;
        }else return false
    }

    remove(compareBY:Function){
        const index = this.findIndex(compareBY)
        if(index!==-1){
            this._elementos.splice(index,1);
            return true;
        }else return false
    }

    replace(element:T,compareBY:Function){
        const index = this.findIndex(compareBY)
        if(index!==-1){
            this._elementos.splice(index,1,element);
            return true;
        }else{
            this._elementos.push(element);
            return false
        }
    }

    clear(){
        this._elementos = new Array();
    }
}