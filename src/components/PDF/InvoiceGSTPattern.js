// import logo from './img.png'
import moment from 'moment';
import numWords from 'num-words'

/** Invoice Template */
const invoicePatternGST = ({ company, gstEnabled, client, voucherNo, billingDate, products, grossTotal, gstTotal, subTotal, totalAmount, discount, discountValue, amountPaid, voucherType }) => {
    const { name, address, contacts, gst } = company;
    console.log(company);
    return `
<!DOCTYPE html >
<html >

<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
	<link rel='stylesheet' type='text/css' href='invoice.css' />
	
	<title>Invoice - ${voucherNo}</title>
</head>  
<style> 
* {
    margin: 0;
    padding: 0;
}

body {
    font: 14px/1.4 Arial, Helvetica, sans-serif;
}

#page-wrap {
    width: 725px;
    margin: 0 auto;
}

textarea {
    border: 0;
    font: 14px Georgia, Serif;
    overflow: hidden;
    resize: none;
}

table {
    border-collapse: collapse;
}

table td,
table th {
    border: 1px solid black;
    padding: 5px;
}

#hiderow,
.delete {
    display: none;
}

#header {
    
    width: 100%;
    margin: 20px 0;
    background: #222;
    text-align: center;
    color: white;
    font: bold 15px Helvetica, Arial, Sans-Serif;
    text-decoration: uppercase;
    letter-spacing: 20px;
    padding: 8px 0px;
}

#identity {
    text-align : center;
}

#company {
    display: inline-block;
    width: 250px;
    height: 100px;
}



#customer {
    overflow: hidden;
}

#logo {
    text-align: right;
    float: right;
    position: relative;
    margin-top: 25px;
    border: 1px solid #fff;
    max-width: 540px;
    max-height: 100px;
    overflow: hidden;
}

#customer-title {
    font-size: 20px;
    font-weight: bold;
    
}

#meta {
    margin-top: 1px;
    width: 200px;
    float: right;
    margin-bottom: 10px;
}

#meta td {
    text-align: right;
}

#meta td.meta-head {
    text-align: left;
    background: #eee;
}

#items {
    clear: both;
    width: 100%;
    margin: 30px 0 0 0;
    border: 1px solid black;
    
}

#items th {
    background: #eee;
}

#items textarea {
    width: 80px;
    height: 50px;
}

#items tr.item-row td {
    padding-bottom: 5px;
    text-align: center;
    border: 0;
    vertical-align: top;
}

#items td.description {
    width: 300px;
}

#items td.item-name {
    width: 200px;
}

#items td.sno {
    width: 2rem;
}

#items td.description textarea,
#items td.item-name textarea {
    width: 100%;
}

#items td.total-line {
    border-right: 0;
    text-align: right;
}

#items td.total-value {
    border-left: 0;
    // padding: 10px;
}

#items td.total-value  {
    background: none;
    // text-align: center;
}

#items td.balance {
    background: #eee;
}

#items td.blank {
    border: 0;
}
#items td.end {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}

#terms {
    text-align: center;
    margin: 20px 0 0 0;
}

.footer {

}

#payment {
    margin: 16px 0 0 0;
}

#signature {
    margin-top: -56px;
    text-align: right;
    padding-top: 5px;
}

#sign {
    padding-top: 45px;
}

#terms h5 {
    text-transform: uppercase;
    font: 13px Helvetica, Sans-Serif;
    letter-spacing: 10px;
    border-bottom: 1px solid black;
    padding: 0 0 8px 0;
    margin: 0 0 8px 0;
}

#terms  {
    width: 100%;
    text-align: center;
}

thead.itembox{
    display: block;
    height: 400px;
}

.text-capital {
    text-align: center;
    text-justify: auto;
    text-transform: capitalize;

}

.start{
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}


</style>
<body>

	<div id="page-wrap">

		<h5 id="header">INVOICE</h5>
		
		<div id="identity">
            <div id="company">
                <h3> ${name} </h3>
                <p> ${Object.values(address).join(', ')} </p>
                ${contacts.map(contact => `<p>${contact.name} - ${contact.phone}</p>`).join('')}
                ${gstEnabled && gst ? (`<p><b>GSTIN </b>${gst}</p>`) : ('')}
            </div>
        </div>
        
        
			
		<div id="customer">
            <p>Bill To :</p>
            <p id="customer-title">${client.name}</p>
            
            <p>${Object.values(client.address).join(', ')}</p>
            ${client.gst && gstEnabled ? (`<p><b>GSTIN</b> ${client.gst}</p>`) : ('')}
        </div>
        <table id="meta">
                <tr>
                    <td class="meta-head">Invoice #</td>
                    <td><span>${voucherNo}</span></td>
                </tr>
                <tr>

                    <td class="meta-head">Date</td>
                    <td><span id="date">${moment(billingDate).format("DD-MM-YYYY")}</span></td>
                </tr>

            </table>
		
		<table id="items">
		
          <thead>
            <tr>
            <th>#</th>
            <th>Name</th>
            <th>HSN</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Amount</th>
            ${voucherType === 'INTRA_STATE' ? (`
            <th colspan='2'>CGST</th>
            <th colspan='2'>SGST</th>`) : ('')}
            ${voucherType === 'INTER_STATE' ? (`
            <th colspan='2'>IGST</th>`) : ('')}
            <th>Total</th>
            </tr>
            <tr>
            <th colspan='7'></th>
            ${voucherType === 'INTRA_STATE' ? (`
            <th>%</th>
            <th>Amt</th>`) : ('')}
            <th>%</th>
            <th>Amt</th>
            <th></th>
            </tr>
            
          </thead>
          <tbody>
          ${products.map((product, i) => {
        return `
                <tr class="item-row" key= ${product.id}>
                    <td className='sno'>${i + 1}.</td>
                    <td class="item-name">${product.name}</td>
                    <td>${product.hsn ? product.hsn : ''}</td>
                    <td>${product.quantity}</td>
                    <td>${product.unit}</td>
                    <td>${(product.price).toFixed(2)}</td>
                    <td>${(product.grossAmount).toFixed(2)}</td>    
            ${voucherType === 'INTRA_STATE' ? (`
                    <td>${product.gstRate / 2}</td>
                    <td>${(product.gstAmount / 2).toFixed(2)}</td>
                    <td>${product.gstRate / 2}</td>
                    <td>${(product.gstAmount / 2).toFixed(2)}</td>`)
                : ('')}
            ${voucherType === 'INTER_STATE' ? (`
                    <td>${product.gstRate}</td>
                    <td>${(product.gstAmount).toFixed(2)}</td>`)
                : ('')}
                    
                    <td>${(product.totalAmount).toFixed(2)}</td>
		        </tr> `;
    })}
        
        ${products.length < 6 ? voucherType === "INTRA_STATE" ? (`
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>
        <tr class="item-row"><td colspan='12'></td></tr>`)
            : voucherType === 'INTER_STATE' ? (`
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>
        <tr class="item-row"><td colspan='10'></td></tr>`) : ('') : ('')}
            

		${voucherType === 'INTRA_STATE' ? (
            `
        <tr class='item-row start'>
            <td colSpan="6" style='text-align : left' className="">Total :  </td>
            <td colSpan="1" className="">${(grossTotal).toFixed(2)}</td>
            <td colSpan="2" >${(gstTotal / 2).toFixed(2)}</td>
            <td colSpan="2" >${(gstTotal / 2).toFixed(2)}</td>
            <td colSpan="1" >${(subTotal).toFixed(2)}</td>
        </tr >
         <tr className=''>
            <td colSpan="8" class="blank"> </td>
            <td colSpan="2" class="total-line">SubTotal : </td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(subTotal).toFixed(2)}</span></td>
        </tr >
        <tr className=''>
            <td colSpan="8" class="blank "></td>
            <td colSpan="2" class="total-line">CGST : </td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(gstTotal / 2).toFixed(2)}</span></td>
        </tr>
        <tr className=''>
            <td colSpan="8" class="blank "></td>
            <td colSpan="2" class="total-line">SGST : </td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(gstTotal / 2).toFixed(2)}</span></td>
        </tr>
        ${discount ? (`
        <tr className=''>
            <td colSpan="6" class="blank"></td>
            <td colSpan="2" class="total-line">Gross Total :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(grossTotal).toFixed(2)}</span></td>
        </tr>
        <tr className=''>
            <td colSpan="6" class="blank"></td>
            <td colSpan="2" class="total-line">Discount :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(discountValue).toFixed(2)}</span></td>
        </tr>
        `) : (``)} 
        <tr className=''>
            <td colSpan="8" class="blank end text-capital">(in words) ${numWords(parseInt(totalAmount))} rupees only</td>
            <td colSpan="2" class="total-line">Total</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${totalAmount.toFixed(2)}</span></td>
        </tr>`

        ) : ('')
        }
        ${voucherType === 'INTER_STATE' ? (
            `
            <tr class='item-row start'>
            <td colSpan="6" style='text-align : left' className="">Total  </td>
            <td colSpan="1" className="">${(subTotal).toFixed(2)}</td>
            <td colSpan="2" >${(gstTotal).toFixed(2)}</td>
            <td colSpan="1" >${(grossTotal).toFixed(2)}</td>
        </tr >
            <tr className=''>
            <td colSpan="6" class="blank start"> </td>
            <td colSpan="2" class="total-line">Sub Total :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(subTotal.toFixed(2))}</span></td>
        </tr >
        <tr className=''>
            <td colSpan="6" class="blank"></td>
            <td colSpan="2" class="total-line">IGST :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(gstTotal).toFixed(2)}</span></td>
        </tr>
        ${discount ? (`
        <tr className=''>
            <td colSpan="6" class="blank"></td>
            <td colSpan="2" class="total-line">Gross Total :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(grossTotal).toFixed(2)}</span></td>
        </tr>
        <tr className=''>
            <td colSpan="6" class="blank"></td>
            <td colSpan="2" class="total-line">Discount :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${(discountValue).toFixed(2)}</span></td>
        </tr>
        `) : (``)} 
        <tr className=''>
            <td colSpan="6" class="blank end text-capital">(in words) ${numWords(parseInt(totalAmount))} rupees only</td>
            <td colSpan="2" class="total-line">Total :</td>
            <td colSpan="2" class="total-value"><span id="total">Rs. ${totalAmount.toFixed(2)}</span></td>
        </tr>`
        ) : ('')
        }
        
        
        </tbody>
        </table>

        <div class="footer">
        <div id="payment">
        <p> For the current bill. </p>
        <p> <span class="payment-due">Paid:</span> <span id="totalDue">Rs. ${amountPaid.toFixed(2)}</span> </p>
        <p> <span class="payment-due">Remaining:</span> <span id="totalDue">Rs. ${(totalAmount - amountPaid).toFixed(2)}</span> </p>
        
        <div id="signature">
        <p >For ${name}</p>
        <p id='sign'>Authorized Signature</p>
        </div>
        </div>
		
		<div id="terms">
		  <h5>Terms</h5>
		  <span>All jurisdiction are subjected to district court.</span>
		</div>
	
	</div>
	
</body>

</html>
`;
}
export default invoicePatternGST;