import { promises as fs, existsSync, writeFileSync } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkFile = () => {
        // si el producto no existe, lo crea
        !existsSync(this.path) && writeFileSync(this.path, "[]", "utf-8");
    };

    async addProduct(titulo, descripcion, precio, imagen, codigo, stock) {
        const prodObj = { titulo, descripcion, precio, imagen, codigo, stock };

        // Comprueva si al producto le falta completar algun dato 
        if (Object.values(prodObj).includes("") || Object.values(prodObj).includes(null)) {
            console.log("'ERROR',campo incompleto");
        } else {
            this.checkFile();
            try {
                // lee los elementos
                const read = await fs.readFile(this.path, "utf-8");
                let data = JSON.parse(read);
                // comprueba si ya existe el elemento
                if (data.some((elem) => elem.code === prodObj.code)) {
                    throw "Code " + code + " already exists, cannot add";
                } else {
                    let newID;
                    !data.length ? (newID = 1) : (newID = data[data.length - 1].id + 1);
                    // guarda el producto en el array
                    data.push({ ...prodObj, id: newID });
                    // Write data to the file
                    await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    async getProducts() {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            let data = JSON.parse(read);
            console.log(data);
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    async getProductByID(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const found = data.find((prod) => prod.id === id);
            if (!found) {
                throw "ID no encontrado";
            } else {
                console.log(found);
                return found;
            }
        } catch (err) {
            console.error(err);
        }
    }

    async updateProduct(id, titulo, descripcion, precio, imagen, codigo, stock) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            if (data.some((prod) => prod.id === id)) {
                const index = data.findIndex((prod) => prod.id === id);
                data[index].titulo = titulo;
                data[index].descripcion = descripcion;
                data[index].precio = precio;
                data[index].imagen = imagen;
                data[index].codigo = codigo;
                data[index].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "ID no encontrado";
            }
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(id) {
        this.checkFile();
        try {
            const read = await fs.readFile(this.path, "utf-8");
            const data = JSON.parse(read);
            const index = data.findIndex((prod) => prod.id === id);
            if (index !== -1) {
                data.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(data), "utf-8");
            } else {
                throw "ID " + id + " no existente";
            }
        } catch (err) {
            console.log(err);
        }
    }
}

// TESTING
// - Crear instancia de ProductManager
const manager = new ProductManager("./database.json");

manager.getProducts();
//manager.getProductByID(2);
//manager.updateProduct(...)
//manager.deleteProduct(3)