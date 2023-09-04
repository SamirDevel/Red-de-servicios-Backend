import { Callback } from "typeorm";

export default class ListaCorp<T>{
    private _elementos:T[]

    constructor(lista1?:T[]){
        this._elementos = lista1!==undefined? lista1.map(item=>item):new Array();
    }

    get elementos():T[]{
        return this._elementos;
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
        //console.log(this._elementos)
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
}