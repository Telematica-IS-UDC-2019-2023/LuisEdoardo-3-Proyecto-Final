if (!String.contains) {
    String.prototype.contains = function (e) {
        return this.indexOf(e) >= 0;
    }
}


function recorrerEnOrden() {
    var cor1 = [],
        cor2 = [];

    Recorrido.preorden(nodoA, cor1);
    console.info("Recorrido PreOrden", cor1)

    Recorrido.postorden(nodoA, cor2);
    console.info("Recorrido PostOrden", cor2)

}



function nuevoArbol() {
    let expresion = document.getElementById('txtE').value
    var nodos = Arbol.crear(expresion);
    window.nodoA = nodos[0];

    recorrerEnOrden();

    console.info(nodos);
}


var Oper = {

    operadores: {
        '^': 5,
        '*': 4,
        '/': 4,
        '+': 3,
        '-': 3,
        ')': 2,
        '(': 1,
        obtenerPrecedencia: function () {

        }
    },

    
    //Depura la expresion algebraica, quita espacios en blanco y deja un espacio entre operadores y dijitos
    prepararExpresion: function (expresion) {
        var operadores = "+-*/()^";
        var salida = "";
        expresion = expresion.replace(/\\s+/, '');
        expresion = "(" + expresion + ")";
        for (var i = 0; i < expresion.length; i++) {
            if (operadores.contains(expresion.charAt(i))) {
                salida += " " + expresion.charAt(i) + " ";
            } else {
                salida += expresion.charAt(i);
            }

        }
        return salida.trim();
    },
    //Determinar jerarquia de operadores
    jerarquia: function (operador) {
        if (this.operadores[operador]) {
            return this.operadores[operador];
        }
        //si no es un operador tiene mayor precedencia
        return 99;
    },
    aPosFija: function (expresion) {
        expresion = this.prepararExpresion(expresion);
        var infija = expresion.split(" ");

        var entrada = infija.reverse(), // Entrada
            T = [], // Temporal
            S = []; //salida

        while (entrada.length > 0) {

            // E[E.length - 1] extrae el ultimo valor de la pila  .peek();
            // console.info("E", E, "S", S, "P", P)
            switch (this.jerarquia(entrada[entrada.length - 1])) {
            case 1:
                T.push(entrada.pop());
                break;
            case 2:
                while (T[T.length - 1] != "(") {
                    S.push(T.pop())
                }
                T.pop();
                entrada.pop();
                break;
            case 3:
            case 4:
            case 5:
                while (this.jerarquia(T[T.length - 1]) >= this.jerarquia(entrada[entrada.length - 1])) {
                    S.push(T.pop());
                }
                T.push(entrada.pop());
                break;
            default:
                S.push(entrada.pop());
            }
        }
            //quita las comas y coloca espacio
        return S.join(" ")
            //elimina 2 o mas espacios juntos
            .replace(/\s{2,}/g, ' ').
            //elimina espacios al inicio y final
        trim();
    }


};

var Arbol = {

    crear: function (expresion) {
        var postfija = Oper.aPosFija(expresion);
        console.info("Expresion posfija: ", postfija);
        //ejemplo Posfija = "2 23 6 + * 1 -";

        var postfija = postfija.split(" ");



        //Declaración de las pilas
        var E = postfija.reverse(); //Pila entrada
        var P = []; //Pila de operandos
        console.info(E)
        //Algoritmo de Evaluación Postfija
        var operadores = "+-*/%^";
        while (E.length > 0) {
            //Si es un operador
            if (operadores.contains(E[E.length - 1])) {
                P.push(this.crearNodo(E.pop(), P.pop(), P.pop()));
            } else {
                P.push(E.pop());
            }
        }
        //retorna nodos
        return P;
    },


    evaluar: function (operador, n2, n1) {
        console.info(n1 + operador + n2);

        if (operador == '^') {
            return Math.pow(n1, n2);
        }
        return eval(n1 + operador + n2);
    },
    getNumber: function (x) {
        if (isNaN(x)) {
            return x.data
        }
        return x;
    },
    getInfo: function (y) {
        // Es un digito
        if (!isNaN(y)) {
            return {
                label: y
            }
        }
        // Es resultado de una operacion
        return y;
    },
    crearNodo: function (operador, n2, n1) {
        return {
            label: operador,
            expanded: true,
            children: [this.getInfo(n1), this.getInfo(n2),
        ],
            data: this.evaluar(operador, this.getNumber(n2), this.getNumber(n1))
        };
    }
};

var Recorrido = {
    //(raíz, izquierdo, derecho)
     
    preorden: function (nodo, log) {
        if (nodo == null)
            return;

        //mostrar datos del nodo
        log.push(nodo.label);
        if (!nodo.children)
            return;
        this.preorden(nodo.children[0], log); //recorre subarbol izquierdo
        this.preorden(nodo.children[1], log); //recorre subarbol derecho
    },
    //(izquierdo, derecho, raíz)
    postorden: function (nodo, log) {
        if (nodo == null)
            return;
        if (nodo.children) {
            this.postorden(nodo.children[0], log);
            this.postorden(nodo.children[1], log);
        }
        log.push(nodo.label);
        // console.info(nodo.label);
    }
    
}