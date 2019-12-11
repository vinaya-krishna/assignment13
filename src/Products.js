import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'

let PRODUCTS = {};

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: PRODUCTS
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount(){
        /**
         * Get all products from the database
         */
        fetch(`/product/get`)
        .then(data => data.json())
        .then(data => this.setState({products:data}))
    }

    handleFilter(filterInput) {
        this.setState(filterInput)
    }

    handleSave(product) {

        product.productid = new Date().getTime()
        product.instock = true;

        /**
         * Set the new product to the state
         */
        this.setState((prevState) => {
            let products = prevState.products
            products[product.productid] = product
            return { products }
        })

        /**
         * Persist the data in mongodb
         */
        var data = {'product' : product, 'id': product.productid}
        fetch('/product/create',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                        'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    handleDestroy(productId) {
        /**
         * Update the state when a item deleted
         */
        this.setState((prevState) => {
            let products = prevState.products
            delete products[productId]
            return { products }
        });

        /**
         * Delete the item from the database
         */
        fetch(`/product/delete/${productId}`,{
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                        'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(response)
        })
        .catch(error =>{
            console.log(error)
        })


    }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters 
                    onFilter={this.handleFilter}></Filters>
                <ProductTable 
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}></ProductTable>
                <ProductForm
                    onSave={this.handleSave}></ProductForm>
            </div>
        )
    }
}

export default Products