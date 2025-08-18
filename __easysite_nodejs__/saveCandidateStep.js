// Save candidate step data to database
async function saveCandidateStep(stepIndex, stepData, candidateId = null) {
    try {
        const stepKeys = ['basicInfo', 'cv', 'analysis', 'challenge', 'interview', 'evaluation'];
        const currentStepKey = stepKeys[stepIndex];
        
        if (!currentStepKey) {
            throw new Error('Invalid step index');
        }

        // If this is the first step (basicInfo) and no candidateId, create new record
        if (stepIndex === 0 && !candidateId) {
            const candidateRecord = {
                candidate_id: 'cand_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                full_name: stepData.fullName || '',
                email: stepData.email || '',
                phone: stepData.phone || '',
                experience_years: parseInt(stepData.experience) || 0,
                education: stepData.education || '',
                specialization: stepData.specialization || '',
                persona: stepData.persona || 'medical',
                expected_salary: stepData.expectedSalary || '',
                current_step: stepIndex + 1,
                application_status: 'active'
            };

            const result = await window.ezsite.apis.tableCreate(35304, candidateRecord);
            if (result.error) {
                throw new Error(result.error);
            }

            return {
                success: true,
                candidateId: candidateRecord.candidate_id,
                message: 'Candidate created successfully'
            };
        }

        // For existing candidates, update the record
        if (candidateId) {
            // Get existing candidate record
            const existingResult = await window.ezsite.apis.tablePage(35304, {
                PageNo: 1,
                PageSize: 1,
                Filters: [
                    { name: "candidate_id", op: "Equal", value: candidateId }
                ]
            });

            if (!existingResult.data?.List?.[0]) {
                throw new Error('Candidate not found');
            }

            const candidateRecord = existingResult.data.List[0];
            let updateData = {
                ID: candidateRecord.ID,
                current_step: Math.max(candidateRecord.current_step, stepIndex + 1)
            };

            // Update specific fields based on step
            switch (stepIndex) {
                case 0: // Basic Info
                    updateData = {
                        ...updateData,
                        full_name: stepData.fullName || candidateRecord.full_name,
                        email: stepData.email || candidateRecord.email,
                        phone: stepData.phone || candidateRecord.phone,
                        experience_years: parseInt(stepData.experience) || candidateRecord.experience_years,
                        education: stepData.education || candidateRecord.education,
                        specialization: stepData.specialization || candidateRecord.specialization,
                        persona: stepData.persona || candidateRecord.persona,
                        expected_salary: stepData.expectedSalary || candidateRecord.expected_salary
                    };
                    break;
                
                case 1: // CV Upload
                    updateData = {
                        ...updateData,
                        cv_file_name: stepData.fileName || candidateRecord.cv_file_name,
                        cv_text_extract: stepData.extractedText || candidateRecord.cv_text_extract
                    };
                    break;
                
                case 2: // AI Analysis - handled by analyzeCV function
                    // No direct update needed here as analysis is stored separately
                    break;
                
                case 3: // Challenge
                    // Store challenge responses if needed
                    break;
                
                case 4: // Interview
                    // Interview data is stored in interview_sessions table
                    break;
                
                case 5: // Evaluation
                    updateData = {
                        ...updateData,
                        application_status: stepData.completed ? 'completed' : 'active'
                    };
                    break;
            }

            const result = await window.ezsite.apis.tableUpdate(35304, updateData);
            if (result.error) {
                throw new Error(result.error);
            }

            return {
                success: true,
                candidateId: candidateId,
                message: 'Candidate step updated successfully'
            };
        }

        throw new Error('No candidate ID provided for step update');

    } catch (error) {
        console.error('Save candidate step error:', error);
        throw new Error(`فشل في حفظ بيانات الخطوة: ${error.message}`);
    }
}