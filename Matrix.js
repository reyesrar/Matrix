class Matrix {
  constructor(matrix) {
    this.matrix = matrix;
  }

  add(otherMatrix) {
    if (!this.canAdd(otherMatrix)) {
      return ("Las matrices no tienen el mismo tamaño");
    }

    const result = this.matrix.map((row, i) => {
      return row.map((_, j) => {
        return _ + otherMatrix.matrix[i][j];
      });
    });
    return new Matrix(result);
  }

  substract(otherMatrix) {
    if (!this.canSubstract(otherMatrix)) {
      return ("Las matrices no tienen el mismo tamaño");
    }

    const result = this.matrix.map((fila, i) => {
      return fila.map((_, j) => {
        return _ - otherMatrix.matrix[i][j];
      });
    });
    return new Matrix(result);
  }

  multiply(otherMatrix) {
    if (!this.canMultiply(otherMatrix)) {
      return("Las matrices no se pueden multiplicar");
    }

    const result = this.matrix.map((fila) => {
      return otherMatrix.matrix[0].map((_, j) => {
        return fila.reduce((acc, factor, i) => {
          return acc + factor * otherMatrix.matrix[i][j];
        }, 0);
      });
    });
    return new Matrix(result);
  }

  getTransposed() {
    const transposed = new Matrix(this.matrix[0].map((_, i) => this.matrix.map((row) => row[i])));
    return transposed;
  }

  getIdentityMatrix() {
    const n = this.matrix.length;
    if (this.matrix.length !== this.matrix[0].length) {
      return ("La matriz no es cuadrada");
    }
    const identityMatrix = new Matrix(Array(n).fill(0).map(() => Array(n).fill(0)));

    for (let i = 0; i < n; i++) {
      identityMatrix.matrix[i][i] = 1;
    }

    return identityMatrix;
  }

  getScalarProduct(scalar) {
    const scalarProduct = new Matrix(this.matrix.map((row) => row.map((factor) => factor * scalar)));
    return scalarProduct;
  }

  augmentMatrix(otherMatrix) {
    const result = new Matrix(this.matrix.map((row, i) => {
      return row.concat(otherMatrix.matrix[i]);
    }));
    return result;
  }

  getInverse() {
    if (this.matrix.length !== this.matrix[0].length) {
      return ("La matriz no es cuadrada");
    }

    const n = this.matrix.length;
    const identityMatrix = this.getIdentityMatrix();
    const augmentedMatrix = this.augmentMatrix(identityMatrix);
  
    for (let i = 0; i < n; i++) {
      let pivotRow = i;
      while (pivotRow < n && augmentedMatrix.matrix[pivotRow][i] === 0) {
        pivotRow++;
      }
  
      if (pivotRow === n) {
        return("La matriz no es invertible");
      }
  
      if (pivotRow !== i) {
        [augmentedMatrix.matrix[i], augmentedMatrix.matrix[pivotRow]] = [augmentedMatrix.matrix[pivotRow], augmentedMatrix.matrix[i]];
      }
  
      const pivot = augmentedMatrix.matrix[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmentedMatrix.matrix[i][j] /= pivot;
      }
  
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmentedMatrix.matrix[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix.matrix[k][j] -= factor * augmentedMatrix.matrix[i][j];
          }
        }
      }
    }

    const inverseMatrix = new Matrix(augmentedMatrix.matrix.map((row) => row.slice(n)));
  
    return inverseMatrix;
  }

  getDeterminant() {
    if (this.matrix.length !== this.matrix[0].length) {
      return ("La matriz no es cuadrada");
    }

    const n = this.matrix.length;

    if (n === 1) {
      return this.matrix[0][0];
    }

    if (n === 2) {
      return this.matrix[0][0] * this.matrix[1][1] - this.matrix[0][1] * this.matrix[1][0];
    }

    let determinant = 0;

    for (let i = 0; i < n; i++) {
      const subMatrix = this.matrix.slice(1).map(row => row.filter((_, j) => j !== i));
      determinant += this.matrix[0][i] * new Matrix(subMatrix).getDeterminant() * (i % 2 === 0 ? 1 : -1);
    }

    return determinant;
  }

  canAdd(otherMatrix) {
    return this.matrix.length === otherMatrix.matrix.length && this.matrix[0].length === otherMatrix.matrix[0].length;
  }

  canSubstract(otherMatrix) {
    return this.canAdd(otherMatrix);
  }

  canMultiply(otherMatrix) {
    return this.matrix[0].length === otherMatrix.matrix.length;
  }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('createMatrixA').addEventListener('click', () => {
        createMatrix('rowsA', 'colsA', 'matrixContainerA');
    });

    document.getElementById('createMatrixB').addEventListener('click', () => {
        createMatrix('rowsB', 'colsB', 'matrixContainerB');
    });

    document.getElementById('fillRandomA').addEventListener('click', () => {
      fillRandom('rowsA', 'colsA', 'matrixContainerA');
    });

    document.getElementById('fillRandomB').addEventListener('click', () => {
      fillRandom('rowsB', 'colsB', 'matrixContainerB');
    });

    document.getElementById('createRandomMatrixA').addEventListener('click', () => {
        createAndFillRandom('matrixContainerA');
    });

    document.getElementById('createRandomMatrixB').addEventListener('click', () => {
        createAndFillRandom('matrixContainerB');
    });

    document.getElementById('addMatrices').addEventListener('click', () => {
        performOperation('add');
    });

    document.getElementById('subtractMatrices').addEventListener('click', () => {
        performOperation('substract');
    });

    document.getElementById('multiplyMatrices').addEventListener('click', () => {
        performOperation('multiply');
    });

    document.getElementById('transposeMatrix').addEventListener('click', () => {
        const matrixID = parseFloat(prompt('1 Para Matriz A, 2 Para Matriz B (cualquier otro valor: Matriz A):'));
        if(matrixID === 1){
          performSingleMatrixOperation('transpose', 'matrixContainerA');
        } else if (matrixID === 2){
          performSingleMatrixOperation('transpose', 'matrixContainerB');
        } else {
        performSingleMatrixOperation('transpose', 'matrixContainerA');
        }
    });

    document.getElementById('identityMatrix').addEventListener('click', () => {
      const matrixID = parseFloat(prompt('1 Para Matriz A, 2 Para Matriz B (cualquier otro valor: Matriz A):'));
      if(matrixID === 1){
        performSingleMatrixOperation('identity', 'matrixContainerA');
      } else if (matrixID === 2){
        performSingleMatrixOperation('identity', 'matrixContainerB');
      } else {
      performSingleMatrixOperation('identity', 'matrixContainerA');
      }
    });

    document.getElementById('scalarMultiplyMatrix').addEventListener('click', () => {
        const scalar = parseFloat(prompt('Ingrese el escalar:'));
        const matrixID = parseFloat(prompt('1 Para Matriz A, 2 Para Matriz B (cualquier otro valor: Matriz A):'));
        if(matrixID === 1){
          performSingleMatrixOperation('scalarMultiply', 'matrixContainerA', scalar);
        } else if (matrixID === 2){
          performSingleMatrixOperation('scalarMultiply', 'matrixContainerB', scalar);
        } else {
        performSingleMatrixOperation('scalarMultiply', 'matrixContainerA', scalar);
        }
    });

    document.getElementById('inverseMatrix').addEventListener('click', () => {
      const matrixID = parseFloat(prompt('1 Para Matriz A, 2 Para Matriz B (cualquier otro valor: Matriz A):'));
      if(matrixID === 1){
        performSingleMatrixOperation('inverse', 'matrixContainerA');
      } else if (matrixID === 2){
        performSingleMatrixOperation('inverse', 'matrixContainerB');
      } else {
      performSingleMatrixOperation('inverse', 'matrixContainerA');
      }
    });

    document.getElementById('determinantMatrix').addEventListener('click', () => {
      const matrixID = parseFloat(prompt('1 Para Matriz A, 2 Para Matriz B (cualquier otro valor: Matriz A):'));
      if(matrixID === 1){
        performSingleMatrixOperation('determinant', 'matrixContainerA');
      } else if (matrixID === 2){
        performSingleMatrixOperation('determinant', 'matrixContainerB');
      } else {
      performSingleMatrixOperation('determinant', 'matrixContainerA');
      }
    });
});

function createMatrix(rowsId, colsId, containerId) {
    const rows = parseInt(document.getElementById(rowsId).value);
    const cols = parseInt(document.getElementById(colsId).value);
    const matrixContainer = document.getElementById(containerId);
    matrixContainer.innerHTML = '';
    if (rows > 0 && cols > 0) {
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = 0;
                td.appendChild(input);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        matrixContainer.appendChild(table);
    }
}

function fillRandom(rowsId, colsId, containerId){
    const matrixContainer = document.getElementById(containerId);
    const rows = parseInt(document.getElementById(rowsId).value);
    const cols = parseInt(document.getElementById(colsId).value);
    matrixContainer.innerHTML = '';
    const table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.value = Math.floor(Math.random() * 100);
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    matrixContainer.appendChild(table);
}

function createAndFillRandom(containerId) {
    const rows = Math.floor(Math.random() * 5) + 1;
    const cols = Math.floor(Math.random() * 5) + 1;
    const matrixContainer = document.getElementById(containerId);
    matrixContainer.innerHTML = '';
    const table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.value = Math.floor(Math.random() * 100);
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    matrixContainer.appendChild(table);
}

function getMatrixFromContainer(containerId) {
    const matrixContainer = document.getElementById(containerId);
    const rows = matrixContainer.getElementsByTagName('tr');
    const matrix = [];
    for (let row of rows) {
        const inputs = row.getElementsByTagName('input');
        const matrixRow = [];
        for (let input of inputs) {
            matrixRow.push(parseFloat(input.value));
        }
        matrix.push(matrixRow);
    }
    return new Matrix(matrix);
}

function performOperation(operation) {
    const matrixA = getMatrixFromContainer('matrixContainerA');
    const matrixB = getMatrixFromContainer('matrixContainerB');
    let result;
    try {
        if (operation === 'add') {
            result = matrixA.add(matrixB);
        } else if (operation === 'substract') {
            result = matrixA.substract(matrixB);
        } else if (operation === 'multiply') {
            result = matrixA.multiply(matrixB);
        }
        displayResult(result);
    } catch (error) {
        displayResult(error);
    }
}

function performSingleMatrixOperation(operation, containerId, scalar = null) {
    const matrix = getMatrixFromContainer(containerId);
    let result;
    try {
        if (operation === 'transpose') {
            result = matrix.getTransposed();
        } else if (operation === 'identity') {
            result = matrix.getIdentityMatrix();
        } else if (operation === 'scalarMultiply') {
            result = matrix.getScalarProduct(scalar);
        } else if (operation === 'inverse') {
            result = matrix.getInverse();
        } else if (operation === 'determinant') {
            result = matrix.getDeterminant();
        }
        displayResult(result, operation === 'determinant');
    } catch (error) {
        displayResult(error);
    }
}

function displayResult(result, isDeterminant = false) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    if (typeof result === 'string') {
        resultContainer.textContent = result;
    } else if (isDeterminant) {
        resultContainer.textContent = `Determinante: ${result}`;
    } else {
        const table = document.createElement('table');
        result.matrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        resultContainer.appendChild(table);
    }
}