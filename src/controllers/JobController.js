const Job = require('../model/Job')
const JobUtils = require('../utils/jobUtils')
const Profile = require('../model/Profile')


module.exports = {
   
    create(req,res){
        return res.render("job")
    },

     async save(req, res) {

        //linhas abaixo feitas na aula 1 e 2 onde nao havia banco de dados
        // const jobs = await Job.get()
        // //req.bodt = {name: 'Caio Rodrigo dos Santos Medeiros', 'daily-hours': '0.2', 'total-hours': '9'}
        // const lastId = jobs[jobs.length - 1]?.id || 0;

        await Job.create({
            // id: lastId + 1,
            name: req.body.name,
            "daily-hours": req.body["daily-hours"],
            "total-hours": req.body["total-hours"],
            created_at: Date.now() //atribuindo data de hj
        });

       
    return res.redirect('/')
    },

    async show(req, res){

        const jobId = req.params.id
        const jobs = await Job.get()

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if(!job){
            return res.send('Job not found')
        }

        const profile = await Profile.get()

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return res.render("job-edit", {job})
    },

    async update(req, res){
        const jobId = req.params.id
        // const jobs = await Job.get()

        // const job = jobs.find(job => Number(job.id) === Number(jobId))

        // if(!job){
        //     return res.send('Job not found')
        // }

        const updatedJob = {
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        }

        // const newJobs = jobs.map(job => {

        //     if(Number(job.id)===Number(jobId)){
        //         job = updatedJob
        //     }
            
        //     return job
        // })

        await Job.update(updatedJob, jobId)

        res.redirect('/job/' + jobId)
    },

    async delete(req, res){
        const jobId = req.params.id

        await Job.delete(jobId)
        
        return res.redirect('/')
    }
}