import React, { Component } from 'react'

const RESET_VALUES = {productid: '', category: '', price: '', name: ''}

class ProductForm extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.fillForm = this.fillForm.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this)
        this.state = {
            action:"Save",
            product: Object.assign({}, RESET_VALUES),
            errors: {},
            selectedOption:"In Stock"
        }
    }

    handleOptionChange(changeEvent) {
        this.setState({
            selectedOption: changeEvent.target.value
          });
        var option = changeEvent.target.value;
        this.setState((prevState) => {
            if(option === "In Stock"){
                console.log("In")
                prevState.product.instock = true;
            }
            else{
                console.log("Out")
                prevState.product.instock = false;
            }
            return { product: prevState.product }
        })
    }

    fillForm(productToModify) {
        this.setState({product : productToModify, action:"Update"});
    }
        
    handleChange(e) {
        const target = e.target
        const value = target.value
        const name = target.name
    
        this.setState((prevState) => {
            prevState.product[name] = value
            return { product: prevState.product }
        })
    }

    handleSave(e) {

        if(this.state.action === "Save") {
            this.props.onSave(this.state.product);
        }
        else if(this.state.action === "Update") {
            this.props.onUpdate(this.state.product)
        }
        
        // reset the form values to blank after submitting
        this.setState({
            product: Object.assign({}, RESET_VALUES), 
            errors: {},
            action:"Save"
        })
        // prevent the form submit event from triggering an HTTP Post
        e.preventDefault()
    }

    render () {
        return (
            <form>
                <h4>Add a new product</h4>
                <p>
                    <label>Name <br /> 
                    <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.product.name} /></label>
                </p>
                <p>
                    <label>Category <br /> 
                    <input type="text" className="form-control" name="category" onChange={this.handleChange} value={this.state.product.category} /></label>
                </p>
                <p>
                    <label>Price <br /> 
                    <input type="text" className="form-control" name="price" onChange={this.handleChange} value={this.state.product.price} /></label>
                </p>

                <div className="form-check">
                    <input className="form-check-input" type="radio" value="In Stock" checked={this.state.product.instock === true} onChange={this.handleOptionChange}/>
                    <label className="form-check-label">In Stock</label>
                      
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" value="Out Of Stock" checked={this.state.product.instock === false} onChange={this.handleOptionChange}/>
                    <label className="form-check-label">Out Of Stock</label>
                </div>
                <br/>

                <input type="submit" className="btn btn-info" value={this.state.action} onClick={this.handleSave}></input>
            </form>
        )
    }
}

export default ProductForm