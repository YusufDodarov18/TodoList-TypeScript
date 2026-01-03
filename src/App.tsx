import { useEffect, useState } from 'react'
import axios from "axios"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Select, SelectContent, SelectGroup, SelectItem,  SelectTrigger, SelectValue } from './components/ui/select';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from "@mui/material/Checkbox";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { Input } from './components/ui/input';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { OrbitProgress } from "react-loading-indicators"


export interface Data{
    id:string
    name:string
    completed:boolean
    phone:string
    age:number|null
}

function App() {
  const [data,setData]=useState<Data[]>([])
  const [loading,setLoading]=useState<boolean>(false)
  const [name,setName]=useState<string>("")
  const [phone,setPhone]=useState<string>("")
  const [age, setAge] = useState<number | null>(null)
  const [select,setSelect]=useState<string>("")
  const [open, setOpen] = useState(false);
  const [nameEdit,setNameEdit]=useState<string>("")
  const [phoneEdit,setPhoneEdit]=useState<string>("")
  const [ageEdit, setAgeEdit] = useState<number | null>(null)
  const [idx,setIdx]=useState<string|null>(null)
  const [search,setSearch]=useState<string>("")
  
  const api=`https://695919c06c3282d9f1d69ed2.mockapi.io/todolist/todolist`
 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    const get=async()=>{
      setLoading(true)
      const data=await axios.get(api)
      setData(data.data)
      setLoading(false)
    }
    get()
  },[])


    const AddTodo=async()=>{
      if(name.trim()!==""&&phone.trim()!==""&&age!==0){
          const data=await axios.post(api,{name:name,phone:phone,age:age,completed:false})
          setData(prevData=>[...prevData,data.data])
          toast.success("Add Todo")
      }
    }

    const DeleteTodo=async(id:string)=>{
      await axios.delete(`${api}/${id}`)
      setData(prevData=>prevData.filter(e=>e.id!==id))
      toast.success("Delete Todo")
    }

    const CompletedTodo=async(el:Data)=>{
      await axios.put(`${api}/${el.id}`,{
        completed:!el.completed
      })
      setData(prevData=>prevData.map(e=>e.id===el.id?{...e,completed:!e.completed}:e))
      toast.success(el.completed?"Active":"InActive")
    }

    const EditTodo=async()=>{
      if(idx!==null) {
        await axios.put(`${api}/${idx}`,{name:nameEdit,phone:phoneEdit,age:ageEdit,})
        setData(prevData=>prevData.map(e=>e.id===idx?{...e,name:nameEdit,phone:phoneEdit,age:ageEdit}:e))
        toast.success("Todo Updated")
        handleClose()
      }
    }

    const filter=data.filter(e=>e.name.toLowerCase().includes(search.toLowerCase().trim())).filter(e=>{
      if(select=="Active"){
        return e.completed===false
      }else if(select=="Inactive"){
        return e.completed===true
      }else{
        return true
      }
    })


  return (
    <Box>
      <Box className="py-7 px-9 flex gap-3">
        <Input type='search' placeholder='search..' value={search} onChange={(ev)=>setSearch(ev.target.value)} />
          <Select value={select} onValueChange={(value)=>setSelect(value)} >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectGroup>
      </SelectContent>
       </Select>
      </Box>
     <Box className="flex justify-center flex-col items-center gap-5 md:flex-row">
       <TextField value={name} onChange={(ev)=>setName(ev.target.value)} label="enter your name" variant="filled" />
        <TextField value={age??""} onChange={(ev)=>setAge(ev.target.value===""?null:Number(ev.target.value))} type='number' label="enter your age" variant="filled" />
        <TextField value={phone} onChange={(ev)=>setPhone(ev.target.value)} label="enter your phone" variant="filled" />
        <Button variant='contained' onClick={AddTodo} className='bg-blue-500 w-50 md:w-20 md:h-13 cursor-pointer'>Add</Button>
     </Box>
     <Box className="flex justify-center items-center px-10 py-10">
       <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              {loading&&<OrbitProgress color="#32cd32" size="medium" text="" textColor="" />}
              <TableHead>
                <TableRow>
                  <TableCell align='left'>#</TableCell>
                  <TableCell align='left'>Name</TableCell>
                  <TableCell align='left'>Age</TableCell>
                  <TableCell align='left'>Phone</TableCell>
                  <TableCell align='left'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filter.length===0?<TableRow><TableCell colSpan={4}>Empty: 0</TableCell></TableRow>:
                filter.map((el,i:number) => (
                  <TableRow
                    key={el.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{i+1}</TableCell>
                    <TableCell align='left' className={`${el.completed?'line-through':""}`}>{el.name}</TableCell>
                    <TableCell align="left" className={`${el.completed?'line-through':""}`}>{el.age}</TableCell>
                    <TableCell align="left" className={`${el.completed?'line-through':""}`}>{el.phone}</TableCell>
                    <TableCell align="left">
                      <Checkbox checked={el.completed} onChange={()=>CompletedTodo(el)} />
                      <EditIcon onClick={()=>{
                        const exist=data.find(e=>e.id===el.id)
                        if(exist){
                          setNameEdit(exist.name)
                          setPhoneEdit(exist.phone)
                          setAgeEdit(exist.age)
                          setIdx(el.id)      
                        }
                        handleClickOpen()
                      }} className='text-orange-500 cursor-pointer'/>
                      <DeleteIcon onClick={()=>DeleteTodo(el.id)} className='text-red-500 cursor-pointer'/>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
     </Box>
          <Dialog open={open} onClose={handleClose}>
             <DialogTitle>{"Edit Task"}</DialogTitle>
            <DialogContent>
              <DialogContentText className='flex gap-3 flex-col'>
                <Input className='w-100' value={nameEdit} onChange={(ev)=>setNameEdit(ev.target.value)} />
                <Input className='w-100' value={phoneEdit} onChange={(ev)=>setPhoneEdit(ev.target.value)} />
                <Input className='w-100' value={ageEdit??""} onChange={(ev)=>setAgeEdit(ev.target.value===""?null:Number(ev.target.value))} />
              </DialogContentText>
            </DialogContent>
            <DialogActions> 
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={EditTodo} autoFocus>Save</Button>
            </DialogActions>
          </Dialog>
     <Toaster />
    </Box>
  )
}

export default App
