import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const ReceiptPage = ({ }) => {
    const location = useLocation();
    const { products, totalWithGST } = location.state;
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text('Levitation Infotec', 135, 20, null, null, 'left');

        // Product List
        let startY = 40;
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text('Product', 10, startY);
        doc.text('Qty', 60, startY);
        doc.text('Rate', 100, startY);
        doc.text('Total', 140, startY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        startY += 15;
        products.forEach((product, index) => {
            doc.text(product.name, 14, startY + index * 10);
            doc.setTextColor(0, 0, 255);
            doc.text(product.qty.toString(), 60, startY + index * 10);
            doc.setTextColor(0, 0, 0);
            doc.text(product.rate.toFixed(2), 100, startY + index * 10);
            doc.text(product.total.toFixed(2), 140, startY + index * 10);
        });

        // Total Section
        const totalWithoutGST = products.reduce((acc, product) => acc + product.total, 0);
        const GST = (totalWithoutGST * 0.18).toFixed(2);
        const grandTotal = totalWithGST.toFixed(2);

        const gap = 20; // Adjust the gap as needed

        startY += products.length * 10 + 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total INR:`, 120 - gap, startY);
        doc.text(`${totalWithoutGST.toFixed(2)}`, 140 + gap, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(`GST 18%:`, 120 - gap, startY + 10);
        doc.text(`${GST}`, 140 + gap, startY + 10);
        doc.text('------------------------------------------------------------', 120 - gap, startY + 15);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total:`, 120 - gap, startY + 20);
        doc.setTextColor(0, 0, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`${grandTotal}`, 140 + gap, startY + 20);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('---------------------------------------------------', 120 - gap, startY + 25);

        // Date
        const date = new Date().toLocaleDateString();
        doc.text(`Date: ${date}`, 14, startY + 40);

        // Save the PDF
        doc.save('receipt.pdf');
    };

    // Update the saveReceipt function in ReceiptPage.jsx
    const saveReceipt = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token'); // Assuming you store the JWT token in localStorage
            const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/receipts`,
                { products, totalWithGST },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` // Include the JWT token in the request header
                    }
                }
            );
            if (response.status === 201) {
                alert('Receipt saved successfully');
            } else {
                throw new Error('Failed to save receipt');
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('Failed to save receipt');
        }
        setSaving(false);
    };





    const handleBack = () => {
        navigate('/add-product', { state: { products } });

    };

    return (
        <div className="max-w-md mx-auto mt-8 px-4 bg-white rounded-md shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Receipt</h1>
            <table className="w-full border-collapse border border-stone-600 mb-4">
                <thead>
                    <tr>
                        <th className="border border-stone-600 px-4 py-2">Product</th>
                        <th className="border border-stone-600 px-4 py-2">Qty</th>
                        <th className="border border-stone-600 px-4 py-2">Rate</th>
                        <th className="border border-stone-600 px-4 py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td className="border border-stone-600 px-4 py-2">{product.name}</td>
                            <td className="border border-stone-600 px-4 py-2" style={{ color: 'blue' }}>{product.qty}</td>
                            <td className="border border-stone-600 px-4 py-2">{product.rate.toFixed(2)}</td>
                            <td className="border border-stone-600 px-4 py-2">{product.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="font-semibold mt-4">
                Total with GST 18%: {totalWithGST.toFixed(2)}
            </div>
            <button
                onClick={generatePDF}
                className="block w-full mt-4 px-4 py-2 text-white bg-stone-700 rounded-md hover:bg-stone-800 focus:outline-none focus:bg-stone-800"
            >
                Download PDF
            </button>
            <button
                onClick={saveReceipt}
                disabled={saving}
                className="block w-full mt-4 px-4 py-2 text-white bg-stone-700 rounded-md hover:bg-stone-800 focus:outline-none focus:bg-stone-800"
            >
                {saving ? 'Saving...' : 'Save Receipt'}
            </button>
            <button
                onClick={handleBack}
                className="block w-full mt-4 px-4 py-2 text-white bg-stone-700 rounded-md hover:bg-stone-800 focus:outline-none focus:bg-stone-800"
            >
                Back to Add Products
            </button>
        </div>
    );
};

export default ReceiptPage;
