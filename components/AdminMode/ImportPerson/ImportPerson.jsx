import { regular18 } from "@/styles/fonts";
import { Flex, Icon, Image, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalContent, ModalOverlay, Modal, Text, Button, Input, useToast, Spacer } from "@chakra-ui/react";
import React, { useState } from 'react'
import { styles } from "./ImportPerson.module";
import { HiOutlineDocumentAdd, HiOutlineDownload } from "react-icons/hi";
import Swal from "sweetalert2";
import { white } from "@/utils/colors";
import { URL } from '@/utils/consts'
import postFile from "@/utils/postFile";
import Link from "next/link";

export default function ImportPerson({ isOpen, onClose, listMode }) {
    const [file, setFile] = useState(null)
    const toast = useToast()

    const viewMode = {
        '': {
            header: "",
        },
        add: {
            header: "IMPORTAR PERSONAS",
        },
        edit: {
            header: "IMPORTAR EDICIÓN MASIVA DE PERSONAS",
        }
    }

    const handleSubmit = () => {
        if(!file) {
            toast({
                title: 'Error.',
                description: "No has seleccionado ningún archivo",
                status: "warning",
                duration: 9000,
                isClosable: true,
              })
            return
        }


        if (listMode === 'add') {
            Swal.fire({
                title: '¿Estás seguro que quieres importar este archivo?',
                text: "Se crearán nuevos perfiles de personas",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '¿Estás absolutamente seguro?',
                        text: "Esta acción no se puede revertir.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sé lo que hago y quiero hacerlo',
                        cancelButtonText: 'Cancelar',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await postFile(`${URL}/addImportPersons`, file)
                            if (response.status === 'success') {
                                Swal.fire(
                                    'Personas Importadas',
                                    `Se han importado ${response.linea} personas al sistema.`,
                                    'success'
                                )
                                onClose()
                            } else {
                                Swal.fire(
                                    'Error',
                                    `${response.msg}`,
                                    'error'
                                )
                            }
                        }
                    })
                }
            })
        }
        if (listMode === 'edit') {
            Swal.fire({
                title: '¿Estás seguro que quieres importar este archivo?',
                text: "Se editarán perfiles de personas",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '¿Estás absolutamente seguro?',
                        text: "Esta acción no se puede revertir.",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sé lo que hago y quiero hacerlo',
                        cancelButtonText: 'Cancelar',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await postFile(`${URL}/editImportPersons`, file)
                            if (response.status === 'success') {
                                Swal.fire(
                                    'Personas Editadas',
                                    `Se han editado ${response.linea} personas en el sistema.`,
                                    'success'
                                )
                                onClose()
                            } else {
                                Swal.fire(
                                    'Error',
                                    `${response.msg}`,
                                    'error'
                                )
                            }
                        }
                    })
                }
            })
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{viewMode[listMode].header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex sx={styles.MainContainer}>
                <Flex mb='25px'>
                    <Text sx={regular18}>ESTE ES EL FORMATO QUE DEBE LLEVAR EL DOCUMENTO</Text>
                </Flex>
                <Image src='example.png' alt='tabla de ejemplo de excel'/>
                <Flex w='400px' mt='50px'>
                    <Input
                        type="file"
                        // accept=".xlsx"
                        color="black"
                        onChange={handleFileChange}
                    />
                </Flex>
                {listMode === "edit" &&
                <>
                    <Flex mb='25px' mt='25px'>
                        <Text sx={regular18}>Atención: Cualquier casilla vacía del excel no cambiará los datos del sistema</Text>
                    </Flex>
                    <Image src='example_edit.png' alt='tabla de ejemplo de excel'/>
                    <Flex mb='25px' mt='25px'>
                        {/* eslint-disable-next-line react/no-unescaped-entities*/}
                        <Text sx={regular18}>Ejemplo: Esto únicamente actualizará los datos de "curso/area" de las personas en el sistema</Text>
                    </Flex>
                </>
                }
                
            </Flex>
          </ModalBody>
        <ModalFooter>
        <Link href={'Hoja de excel de ejemplo.xlsx'} passHref>
            <Button
            sx={styles.Button}
            bg='#FF2B91'
            color={white}
            leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                    <HiOutlineDownload />
                </Icon>
                }
            >
                Descargar ejemplo
            </Button>
        </Link>
        <Spacer />
        <Button
        sx={styles.Button}
        bg='#FF2B91'
        color={white}
        leftIcon={
            <Icon fontSize="24px" mb="1px" ml="1px">
                <HiOutlineDocumentAdd />
            </Icon>
            }
        onClick={handleSubmit}
        >
            {listMode === "add" && 'AÑADIR'}
            {listMode === "edit" && 'APLICAR'}
        </Button>
        </ModalFooter>
        </ModalContent>
      </Modal>
    )
}