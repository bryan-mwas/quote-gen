import { Quotation } from "../schemas/quotation.schema";

interface Props {
  qouteData: Quotation;
}

function QuotationReport({ qouteData }: Props) {
  if (!qouteData) {
    return <p>No data available</p>;
  }
  return (
    <section className="w-[595pt] h-[842pt] p-4 shadow-2xl">
      <p>
        <span className="font-bold mx-2">Quote #</span>
        {qouteData.id}
      </p>
      <p>
        <span className="font-bold mx-2">Date</span>
        {qouteData.createdAt}
      </p>
      <section className="grid grid-cols-2 my-4">
        <div id="billingCompany">
          <p className="text-xl text-gray-400">From</p>
          <table>
            <tr>
              <th className="text-justify pr-4">Name</th>
              <td>{qouteData.from.name}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">E-mail</th>
              <td>{qouteData.from.email}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">Phone Number</th>
              <td>{qouteData.from.phoneNumber}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">Address</th>
              <td>{qouteData.from.address}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">Tax ID/PIN</th>
              <td>{qouteData.from.taxID}</td>
            </tr>
          </table>
        </div>
        <div id="recipientCompany">
          <p className="text-xl text-gray-400">To</p>
          <table>
            <tr>
              <th className="text-justify pr-4">Name</th>
              <td>{qouteData.to.name}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">E-mail</th>
              <td>{qouteData.to.email}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">Phone Number</th>
              <td>{qouteData.to.phoneNumber}</td>
            </tr>
            <tr>
              <th className="text-justify pr-4">Address</th>
              <td>{qouteData.to.address}</td>
            </tr>
          </table>
        </div>
      </section>
      <section id="orderLineItems">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase bg-gray-50">
            <tr>
              <th className="p-2">No.</th>
              <th className="p-2">Description</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {qouteData.items.map((quote, idx) => {
              return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{quote.description}</td>
                  <td className="p-2">{quote.qty}</td>
                  <td className="p-2">{quote.price}</td>
                  <td className="p-2">
                    {new Intl.NumberFormat("en-KE", {
                      style: "currency",
                      currency: "KES",
                    }).format(quote.qty * quote.price)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="w-1/4 float-end my-4">
        <div className="flex justify-between">
          <p className="font-bold">Quote Total</p>
          <p>
            {new Intl.NumberFormat("en-KE", {
              style: "currency",
              currency: "KES",
            }).format(
              qouteData.items.reduce((acc, curr) => {
                acc += curr.price * curr.qty;
                return acc;
              }, 0)
            )}
          </p>
        </div>
      </section>
    </section>
  );
}

export default QuotationReport;
