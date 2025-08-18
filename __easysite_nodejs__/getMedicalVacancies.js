
// Get available medical vacancies for Mais Co
async function getMedicalVacancies(filters = {}) {
    try {
        const queryFilters = [];
        
        // Apply filters
        if (filters.specialization) {
            queryFilters.push({
                name: "medical_specialization",
                op: "StringContains",
                value: filters.specialization
            });
        }
        
        if (filters.location) {
            queryFilters.push({
                name: "location",
                op: "StringContains",
                value: filters.location
            });
        }
        
        if (filters.status) {
            queryFilters.push({
                name: "status",
                op: "Equal",
                value: filters.status
            });
        } else {
            // Default to open vacancies only
            queryFilters.push({
                name: "status",
                op: "Equal",
                value: "open"
            });
        }
        
        const { data: vacancies, error } = await window.ezsite.apis.tablePage(35307, {
            PageNo: filters.page || 1,
            PageSize: filters.pageSize || 20,
            OrderByField: "id",
            IsAsc: false,
            Filters: queryFilters
        });
        
        if (error) {
            throw new Error(error);
        }
        
        // If no vacancies exist, create some default medical vacancies for Mais Co
        if (!vacancies.List || vacancies.List.length === 0) {
            const defaultVacancies = [
                {
                    title: "طبيب أشعة تشخيصية",
                    department: "قسم الأشعة",
                    location: "الرياض، السعودية",
                    employment_type: "دوام كامل",
                    experience_required: 3,
                    medical_specialization: "الأشعة التشخيصية",
                    requirements: "بكالوريوس طب وجراحة، شهادة التخصص في الأشعة، خبرة لا تقل عن 3 سنوات، إجادة اللغة العربية والإنجليزية",
                    description: "المسؤولية عن تشخيص وتفسير صور الأشعة المختلفة، العمل مع فريق طبي متكامل في مشاريع طبية متطورة",
                    salary_range: "15,000 - 25,000 ريال سعودي",
                    status: "open",
                    applicants_count: 0
                },
                {
                    title: "مهندس طبي حيوي",
                    department: "قسم الهندسة الطبية",
                    location: "جدة، السعودية",
                    employment_type: "دوام كامل",
                    experience_required: 2,
                    medical_specialization: "الهندسة الطبية الحيوية",
                    requirements: "بكالوريوس هندسة طبية حيوية، خبرة في صيانة الأجهزة الطبية، معرفة بالمعايير الطبية السعودية",
                    description: "صيانة وتطوير الأجهزة الطبية، ضمان جودة المعدات، دعم المشاريع الطبية التقنية",
                    salary_range: "12,000 - 20,000 ريال سعودي",
                    status: "open",
                    applicants_count: 0
                },
                {
                    title: "أخصائي تمريض عناية مركزة",
                    department: "قسم العناية المركزة",
                    location: "الدمام، السعودية",
                    employment_type: "دوام كامل",
                    experience_required: 5,
                    medical_specialization: "تمريض العناية المركزة",
                    requirements: "بكالوريوس تمريض، ترخيص مزاولة مهنة سارية، خبرة في العناية المركزة، شهادات إنعاش متقدمة",
                    description: "تقديم رعاية تمريضية متقدمة للمرضى في العناية المركزة، العمل ضمن فريق طبي متخصص",
                    salary_range: "8,000 - 15,000 ريال سعودي",
                    status: "open",
                    applicants_count: 0
                },
                {
                    title: "محلل مختبرات طبية",
                    department: "قسم المختبرات",
                    location: "الرياض، السعودية",
                    employment_type: "دوام كامل",
                    experience_required: 2,
                    medical_specialization: "تحاليل طبية",
                    requirements: "بكالوريوس تحاليل طبية، ترخيص مزاولة مهنة، خبرة في أجهزة التحليل الحديثة، دقة في العمل",
                    description: "إجراء التحاليل الطبية المختلفة، ضمان جودة النتائج، العمل وفق المعايير الطبية المعتمدة",
                    salary_range: "7,000 - 12,000 ريال سعودي",
                    status: "open",
                    applicants_count: 0
                }
            ];
            
            // Create default vacancies
            for (const vacancy of defaultVacancies) {
                await window.ezsite.apis.tableCreate(35307, vacancy);
            }
            
            // Fetch the newly created vacancies
            const { data: newVacancies } = await window.ezsite.apis.tablePage(35307, {
                PageNo: 1,
                PageSize: 20,
                OrderByField: "id",
                IsAsc: false,
                Filters: queryFilters
            });
            
            return newVacancies;
        }
        
        return vacancies;
    } catch (error) {
        console.error('Get medical vacancies error:', error);
        throw new Error('فشل في جلب الوظائف الطبية. يرجى المحاولة مرة أخرى.');
    }
}
