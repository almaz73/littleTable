import {defineStore} from "pinia";
// import {TableFields} from "@/assets/interfaces"; // нужно разобраться, почему не импортирует

interface TableFields {
    id: number,
    label?: string,
    type: number | null;
    login: string,
    pass: string,
}

function imitationServerGet() {
    return localStorage.getItem('littleTable')
}

function imitationServerPut(text: string) {
    return localStorage.setItem('littleTable', text)
}

export const useLittleTableStores = defineStore("littleTableStores", {
    state: () => ({
        list: []
    }),
    actions: {
        async readTable() {
            const res = await imitationServerGet()
            return res ? JSON.parse(res) : []
        },
        async saveTable(row: TableFields) {
            console.log('row = ', row)
            const res: any = await imitationServerPut(JSON.stringify(row))
            return res
        },
        async deleteRow() {

        },
    }
})