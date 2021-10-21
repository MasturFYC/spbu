import Head from 'next/head'
import React from 'react'
import Layout, { siteTitle } from '../components/layout'
import useUser from '../lib/use-user'
import myLoader from '@lib/image-loader'
import { Flex } from '@react-spectrum/layout'
import { View } from '@react-spectrum/view'
import Shop from '@spectrum-icons/workflow/Shop'
import { ActionButton } from '@react-spectrum/button'
import { Text } from '@react-spectrum/text'
import { Image } from '@react-spectrum/image'
import router from 'next/router'

export default function Home() {
  const { user, mutateUser } = useUser()

  return (
    <Layout home user={user} mutateUser={mutateUser}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex direction={{ base: 'column', M: 'row' }} gap="size-400" alignItems="center">
        <View
          width={{ base: '100%', M: '50%' }}
          paddingX={{ base: 'size-100', M: 'size-600' }}
          marginTop={{ base: '24px', M: 0 }}
        >
          <View>
            <div style={{ fontSize: '32px' }}>Produk dan Layanan</div>
            <div style={{ margin: '24px 0', fontSize: 'medium' }}>
              Pertamina memproduksi berbagai bahan bakar minyak (BBM) dengan beberapa varian dengan
              spesifikasi tertentu. Produk BBM yang dipasarkan terdiri dari bahan bakar bensin,
              bahan bakar untuk mesin diesel, minyak tanah dan bahan bakar aviasi.
            </div>
          </View>
          <View>
            <ActionButton
              UNSAFE_style={{ paddingRight: '6px', paddingLeft: '6px', marginTop: '16px' }}
              onPress={() => {
                router.push('/product')
              }}
            >
              <Shop size="L" />
              <Text>Shop Collection</Text>
            </ActionButton>
          </View>
        </View>
        <View width={{ base: '100%', M: '50%' }} padding={{ base: 'size-100', M: 'size-400' }}>
          <Flex
            justifyContent="center"
            alignItems="center"
            direction={{ base: 'column', M: 'row' }}
            gap="size-100"
          >
            <View flex>
              <Flex direction={{ base: 'row', M: 'column' }} gap="size-100">
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${512}/spbu/6_Z0bcFJBZ9.jpg?updatedAt=1631559650730`}
                  alt="image-0"
                  objectFit="cover"
                  height={16 * 16}
                />
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${512}/spbu/pomp_ORzMbLkUhmc.jpg?updatedAt=1631559650246`}
                  alt="image-1"
                  objectFit="cover"
                  height={16 * 16}
                />
              </Flex>
            </View>
            <View flex>
              <Flex direction={{ base: 'row', M: 'column' }} gap="size-100">
                <Image
                  flex
                  slot="cewek"
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${
                    11 * 16
                  }/spbu/SPBU_hDdGM-09f.jpg?updatedAt=1631559362927`}
                  alt="image-100"
                  objectFit="cover"
                />
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${
                    11 * 16
                  }/spbu/prima-xp_AJMCAQLmajD.jpg?updatedAt=1631559361370`}
                  alt=""
                  objectFit="cover"
                />
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${
                    11 * 16
                  }/spbu/mesran_MQyDJAfVi.jpg?updatedAt=1631559360471`}
                  alt=""
                  objectFit="cover"
                />
              </Flex>
            </View>
            <View flex>
              <Flex direction={{ base: 'row', M: 'column' }} gap="size-100">
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${
                    11 * 16
                  }/spbu/meditran_g10M51zGT.jpg?updatedAt=1631559359533`}
                  alt=""
                  objectFit="cover"
                />
                <Image
                  flex
                  src={`https://ik.imagekit.io/at4uyufqd9s/tr:w-${
                    11 * 16
                  }/spbu/gas_lNQzaaFyU.jpeg?updatedAt=1631559359154`}
                  alt=""
                  objectFit="cover"
                />
              </Flex>
            </View>
          </Flex>
        </View>
      </Flex>
    </Layout>
  )
}
