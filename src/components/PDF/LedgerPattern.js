// import logo from './img.png'
import moment from 'moment';
import numWords from 'num-words'

/** Ledger Template */
const ledgerPattern = ({ company, client, date, ledger, total }) => {
    const { name, address, contacts, gst } = company;
    let prevRunningBalance = 0;
    return `
<!DOCTYPE html >
<html >

<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
	<link rel='stylesheet' type='text/css' href='invoice.css' />
	
	<title>Ledger - ${client?.name}</title>
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

		<h5 id="header">LEDGER</h5>
		
		<div id="identity">
            <div id="company">
                <h3> ${name} </h3>
                <p> ${Object.values(address).join(', ')} </p>
                ${contacts.map(contact => `<p>${contact.name} - ${contact.phone}</p>`).join('')}
                ${(gst) ? (`<p><b>GSTIN </b>${gst}</p>`) : ('')}
            </div>
        </div>
        
        
			
		<div id="customer">
            <p>Details of:</p>
            <p id="customer-title">${client.name}</p>
            
            <p>${Object.values(client.address).join(', ')}</p>
            ${(client.gst) ? (`<p><b>GSTIN</b> ${client.gst}</p>`) : ('')}
        </div>
        <table id="meta">
                <tr>

                    <td class="meta-head">Date</td>
                    <td><span id="date">${moment(date).format("DD-MM-YYYY")}</span></td>
                </tr>

            </table>
		
		<table id="items">
		
          <thead>
            <tr>
            <th>#</th>
            <th>Date</th>
            <th>Voucher No</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Running Balance</th>
          </thead>
          <tbody>
          ${ledger.map((item, i) => {
        const runningBalance = prevRunningBalance + item.debit - item.credit;
        prevRunningBalance = runningBalance;
        return `
                <tr class="item-row" key= ${item.id}>
                    <td className='sno'>${i + 1}.</td>
                    <td class="item-name">${moment(item.date).format("DD-MM-YYYY")}</td>
                    <td>${item.voucherNo ?? ''}</td>
                    <td>${(item.debit).toFixed(2)}</td>
                    <td>${(item.credit).toFixed(2)}</td>    
                    <td>${(runningBalance).toFixed(2)}</td>    
		        </tr> `;
    })}
        
        ${ledger.length < 6 ? (`
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>
        <tr class="item-row"><td colspan='6'></td></tr>`) : ('')}

    <tr className=''>
        <td colSpan="4" class="blank "></td>
        <td colSpan="1" class="total-line">Credit : </td>
        <td colSpan="1" class="total-value"><span id="total">Rs. ${(total?.credit).toFixed(2)}</span></td>
    </tr>
    <tr className=''>
        <td colSpan="4" class="blank "></td>
        <td colSpan="1" class="total-line">Debit : </td>
        <td colSpan="1" class="total-value"><span id="total">Rs. ${(total?.debit).toFixed(2)}</span></td>
    </tr>

    <tr className=''>
            <td colSpan="4" class="blank end text-capital">(in words) ${numWords(parseInt(total?.balance))} rupees only</td>
            <td colSpan="1" class="total-line">Total :</td>
            <td colSpan="1" class="total-value"><span id="total">Rs. ${total?.balance.toFixed(2)}</span></td>
        </tr>
        
        </tbody>
        </table>
		
		<div id="terms">
		  <h5>Terms</h5>
		  <span>All jurisdiction are subjected to district court.</span>
		</div>
	
	</div>
	
</body>

</html>
`;
}
export default ledgerPattern;