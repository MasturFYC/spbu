import React from 'react';
import { initProduct, iProduct, iSpbu } from '../interfaces';
import {
  Button,
  Flex,
  View,
  ProgressCircle,
  SearchField,
  DialogContainer,
} from '@adobe/react-spectrum';
import { ProductForm } from './ProductForm';
import { FormatNumber } from '../../lib/format';
import { useSpbu } from '@lib/use-spbu';
import { comparer, useProduct } from '@lib/use-product';

const title = 'Product List';

const ProductList = ({ role }: { role?: string }) => {

  let spbus = useSpbu();
  let products = useProduct();

  //const { products, mutateProduct, error, isLoading } = useProduct();
  const [product, setProduct] = React.useState<iProduct>(initProduct);
  const [open, setOpen] = React.useState(false);
  const [txtSearch, setTxtSearch] = React.useState<string>('');
  const [isSearching, setIsSearching] = React.useState(false)

  const searchProduct = async () => {
    setIsSearching(true)
    const url = `/api/product/search/${txtSearch}`;
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    await fetch(url, fetchOptions)
      .then(async (response) => {
        if (response.ok) {
          return response.json().then((data) => data);
        }
        return response.json().then((error) => {
          return Promise.reject(error);
        });
      })
      .then((data) => {
        //console.log(data);
        products.setSelectedKeys('all');
        products.removeSelectedItems();
        products.append(...[initProduct, ...data.sort(comparer)]);
      })
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => {
      setIsSearching(false)
    }, 100);
  };

  const updateProduct = async (method: string, id: number, p: iProduct) => {
    const url = `/api/product/${id}`;
    const fetchOptions = {
      method: method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(p),
    };

    const res = await fetch(url, fetchOptions);
    const data: iProduct | any = await res.json();

    if (res.status === 200) {
      setOpen(false);
      if (id === 0) {
        products.append(data);
      } else {
        products.update(id, data);
      }
    }
  };

  const handleSubmit = (e: iProduct) => {
    updateProduct(e.id === 0 ? 'POST' : 'PUT', e.id, e);
  };

  const handleDelete = async () => {
    const url = `/api/product/${product.id}`;
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    const res = await fetch(url, fetchOptions);
    const data: iProduct | any = await res.json();

    if (res.status === 200) {
      setOpen(false);
      products.selectedKeys = new Set('0');
      products.remove(product.id);
    } else {
      console.log('Product cannot be removed!');
    }
  };


  const showSpbuName = (id: number) => {
    const sp = spbus.items.filter(x => x.id === id);
    if (sp.length > 0) {
      return sp[0].name;
    }
    return '-';
  }

  if (spbus.isLoading || products.isLoading || isSearching) {
    return (
      <div className="flex flex-col justify-center content-center items-center h-screen">
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </div>
    );
  }

  return (
    <React.Fragment>
      <DialogContainer
        type={'modal'}
        onDismiss={() => setOpen(false)}
        isDismissable>
        {open && (
          <ProductForm
            spbus={spbus.items}
            productList={[
              { ...initProduct, name: 'none' },
              ...products.items.filter((x) => x.id != product.id),
            ]}
            product={product}
            onDelete={handleDelete}
            updateList={handleSubmit}
          />
        )}
      </DialogContainer>
        <div className="flex flex-col flex-1 justify-center mt-8">
          <SearchField
            alignSelf="center"
            justifySelf="center"
            aria-label="Search product"
            placeholder="e.g. turbo"
            width="auto"
            maxWidth="size-3600"
            value={txtSearch}
            onClear={() => products.reload()}
            onChange={(e) => setTxtSearch(e)}
            onSubmit={() => searchProduct()}
          />
        </div>

        {products && (
        <div className="flex flex-col my-8 px-4 md:mx-20 lg:mx-60 mx-auto">
            {products.items
              .map((p) => (
                <div key={p.id} className="flex -my-px flex-col lg:lex-row md:flex-row sm:gap-x-4 md:gap-x-16 border border-t-0 border-b-1 border-l-0 border-r-0 py-4 border-indigo-400">
                  <div className="sm:w-full md:w-2/5 lg:w-2/5">
                    {role === 'Owner' || role === 'Admin' ?
                      <div className={`cursor-pointer text-4xl mb-4 font text-blue-400 sm:text-6x1 md:text-8x1 hover:text-underline hover:text-blue-600`}
                        onClick={() => {
                          setProduct(p);
                          setOpen(true);
                        }}>
                        {p.id === 0 ? 'New product' : p.name }
                      </div> :
                      <div className={`${p.id === 0 && 'hidden'} font text-4xl text-red-400 sm:text-6x1 md:text-8x1 mb-4`}>{p.name}</div>
                    } 

                    <div className={`${p.id===0 && 'hidden'}`}>
                      <strong>Kode</strong>: {p.code}, <strong>Unit</strong>
                      : {p.unit}, <strong>Octan</strong>: {p.octan},{' '}
                      <strong>SPBU</strong>:{' '}
                      {showSpbuName(p.spbuId)}
                      <div className={`${role !== 'Admin' && role !== 'Owner' && 'hidden'}`}>
                        <strong>Harga DO</strong>:{' '}
                        {FormatNumber(p.buyPrice)},{' '}
                        <strong>Harga POM</strong>:{' '}
                        {FormatNumber(p.salePrice)}
                      </div>
                    </div>
                  </div>
                  <div className={`sm:w-full md:w-3/5 lg:3/5 flex ${p.id === 0 && 'hidden'}`}>
                    <div>
                      {p.description}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
    </React.Fragment>
  );
};

export default ProductList;
